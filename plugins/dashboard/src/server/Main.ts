import path from 'path';
import * as users from 'users';
import { WebSocketServer } from 'ws';
import { RequestHandler } from 'auriserve/router';
import auriserve, { router, log, config, plugins } from 'auriserve';
import { graphql, buildSchema, GraphQLResolveInfo, GraphQLSchema } from 'graphql';

import { User } from 'users';
import { assert, isType } from 'common';

import { getSiteInfo } from './Database';
import './Permissions';

const baseSchema = `
	scalar Date

	type Color {
		h: Float!
		s: Float!
		v: Float!
		a: Float
	}

	type Vec2 {
		x: Float!
		y: Float!
	}

	type Dashboard {
		theme: String!
	}

	type Info {
		name: String!
		domain: String!
		description: String!
	}

	type User {
		identifier: String!
		name: String!
		emails: [String!]!
		roles: [String!]
		permissions: [String!]
		theme: String
	}

	type Role {
		identifier: String!
		name: String!
		permissions: [String!]
	}

	type Permission {
		identifier: String!
		name: String!
		category: String!
		description: String
		default: Boolean!
	}

	type PermissionCategory {
		identifier: String!
		name: String!
		description: String
		icon: String!
		priority: Int!
	}

	type PluginDependency {
		identifier: String!
		version: String!
	}

	type Plugin {
		name: String!
		identifier: String!
		description: String!
		icon: String

		version: String!
		author: String!
		type: String!

		depends: [PluginDependency!]!

		enabled: Boolean!
	}

	type Query {
		info: Info!
		user: User!

		users: [User!]!
		plugins: [Plugin!]

		roles: [Role!]
		permissions: [Permission!]
		permissionCategories: [PermissionCategory!]
	}

	type Mutation {
		createPasswordResetToken(identifier: String!): String!
	}
`;

function trim(templateArgs: TemplateStringsArray, ...args: any[]) {
	const strings = templateArgs
		.reduce((acc, str, i) => {
			acc += str;
			if (i < args.length) acc += args[i];
			return acc;
		}, '')
		.split('\n');

	let firstNonEmpty = -1;
	while (strings[++firstNonEmpty].trim() === '') {}

	const leadingWhitespace = strings[firstNonEmpty].match(/^\s+(?=\S)/)![0];
	const killRegex = new RegExp(`^${leadingWhitespace}`, 'gm');

	return strings.slice(firstNonEmpty).join('\n').replace(killRegex, '');
}

interface Ctx {
	user: User;
	permissions: Set<string>;
	context: any;
}

function gate<T = any>(
	permissions: string[],
	callback: (root: any, ctx: Ctx, info: GraphQLResolveInfo) => T
): (root: any, ctx: any, info: GraphQLResolveInfo) => T | undefined {
	for (const permission of permissions) {
		assert(
			users.permissions.has(permission),
			`Permission '${permission}' does not exist.`
		);
	}

	return (root: any, ctx: Ctx, info: GraphQLResolveInfo) => {
		const userPermissions = ctx.permissions;
		if (!userPermissions.has('administrator')) {
			for (const permission of permissions) {
				if (!userPermissions.has(permission)) {
					return undefined;
				}
			}
		}

		return callback(root, ctx, info);
	};
}

let wss: WebSocketServer | null = null;
let schema: GraphQLSchema | null = null;
const schemaStrings = new Set([baseSchema]);
const routeHandlers: RequestHandler[] = [];

export const gqlResolver: Record<string, any> = {};
export const gqlContext: Record<string, any> = {};

async function init() {
	schema = buildSchema([...schemaStrings.values()].join('\n'));

	gqlResolver.info = getSiteInfo();

	gqlResolver.user = (_: any, ctx: Ctx) => ({ ...ctx.user, permissions: ctx.permissions, theme: 'purple' }),

	gqlResolver.roles = (_: any, ctx: Ctx) => {
		const roles = [...users.roles.values()];
		if (
			!ctx.permissions.has('view_permissions') &&
			!ctx.permissions.has('administrator')
		) {
			roles.forEach((role: any) => ({ ...role, permissions: undefined }));
		}
		return roles;
	};

	gqlResolver.permissions = gate(['view_permissions'], () => users.permissions.values());

	gqlResolver.permissionCategories = gate(['view_permissions'], () => users.permissionCategories.values());

	gqlResolver.users = gate(['view_users'], () => users.listUsers());

	gqlResolver.createPasswordResetToken = gate(['administrator'], (ctx: any) =>
			users.createPasswordResetToken(ctx.identifier ?? ''));

	gqlResolver.plugins = gate(['view_plugins'], () => {
		return [...plugins.values()].map(plugin => ({
			name: plugin.name,
			identifier: plugin.identifier,
			description: plugin.description,
			icon: plugin.icon,
			version: plugin.version.toString(),
			author: plugin.author,
			type: plugin.type ?? 'plugin',
			depends: Object.entries(plugin.depends ?? {}).map(([identifier, version]) => ({ identifier, version })),
			enabled: true
		}));
	});

	routeHandlers.push(
		router.get('/dashboard/res/dashboard.js', (_: any, res: any) => {
			res.sendFile(path.join(__dirname, '..', 'build', 'dashboard.js'));
		}),

		router.get('/dashboard/res/dashboard.js.map', (_: any, res: any) => {
			res.sendFile(path.join(__dirname, '..', 'build', 'dashboard.js.map'));
		}),

		router.post('/dashboard/res/auth', async (req: any, res: any) => {
			try {
				assert(
					isType(req.body.identity, 'string') && isType(req.body.password, 'string'),
					'Missing required information.'
				);

				const token = await users.getAuthToken(
					req.body.identity,
					req.body.password
				);

				res.send(token);
			} catch (e) {
				if ((e as Error).name === 'AssertError') {
					res.status(401).send((e as Error).message);
				} else {
					log.warn('Unhandled error in auth handler: ', e);
					res.sendStatus(400);
				}
			}
		}),

		router.post('/dashboard/res/reset_password', async (req: any, res: any) => {
			try {
				assert(isType(req.body.token, 'string') && isType(req.body.password, 'string'),
					'Missing required information');

				res.send(await users.resetPassword(req.body.token, req.body.password));
			} catch (e) {
				if ((e as Error).name === 'AssertError') {
					res.status(401).send((e as Error).message);
				} else {
					log.warn('Unhandled error in auth handler: ', e);
					res.sendStatus(400);
				}
			}
		}),

		router.post('/dashboard/res/gql', async (req: any, res: any) => {
			try {
				const token = req.headers.token as string;
				assert(token && typeof token === 'string', 'Missing required information.');
				const user = users.getUser(token);
				const permissions = users.getRolePermissions(user.roles);

				res.send(
					await graphql({
						schema: schema!,
						source: req.body.query,
						variableValues: req.body.variables,
						rootValue: gqlResolver,
						contextValue: { permissions, context: gqlContext, user },
					})
				);
			} catch (e) {
				if ((e as Error).name === 'AssertError') {
					res.status(401).send((e as Error).message);
				} else {
					log.warn('Unhandled error in gql handler: ', e);
					res.sendStatus(400);
				}
			}
		})
	);

	setTimeout(() => {
		const dashboardPlugins = [...auriserve.plugins.values()].filter(
			(p) => p.entry.dashboard && p.identifier !== 'dashboard'
		);

		for (const plugin of dashboardPlugins) {
			const basePath = `/dashboard/res/plugin/${plugin.identifier}/`;
			routeHandlers.push(
				router.get(`${basePath}*`, (req: any, res: any) => {
					const reqPath = req.path.replace(basePath, '');
					res.sendFile(
						path.join(
							__dirname,
							'..',
							'..',
							plugin.identifier,
							reqPath
						)
					);
				})
			);
		}

		routeHandlers.push(
			router.get('/dashboard/res/:path', (req: any, res: any) => {
				res.sendFile(path.join(__dirname, '..', 'res', 'dashboard', req.params.path));
			}),

			router.get(['/dashboard', '/dashboard/*'], (req: any, res: any) => {
				const safe = req.query.safe != null;
				res.status(200).send(trim`
				<!DOCTYPE html>
				<html lang='en' class='AS_APP dark'>
					<head>
						<meta charset='utf-8'/>
						<meta name='robots' content='noindex'/>
						<meta name='viewport' content='width=device-width'/>
						<title>Dashboard</title>
						<meta name='description' content='Website dashboard.'/>

						<script src='/dashboard/res/dashboard.js'></script>
						${!safe && dashboardPlugins
							.map((plugin) => `<script src='/dashboard/res/plugin/${plugin.identifier}/
								${plugin.entry.dashboard}'></script>`)
							.join('\n')}
					</head>
					<body id='root'>
					</body>
				</html>`);
			})
		);

		if (config.debug && !wss) {
			log.info('[Dashboard] Starting Debug Websocket Server.');
			wss = new WebSocketServer({ port: 11148 });
			wss.on('connection', (ws) => auriserve.once('cleanup', () => ws.close()));
			auriserve.once('cleanup', () => wss!.close());
		}
	}, 100);
}

function cleanup() {
	routeHandlers.forEach((handler) => router.remove(handler));
	// this.schemaStrings = new Set();
	// as.dashboard.gqlContext = {};
	// as.dashboard.gqlResolver = {};
}

export function extendGQLSchema(schema: string) {
	schemaStrings.add(schema);
	cleanup();
	init();

	return () => {
		schemaStrings.delete(schema);
		cleanup();
		init();
	};
}

setImmediate(() => init());
auriserve.once('cleanup', () => cleanup());
