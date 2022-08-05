import path from 'path';
import as from 'auriserve';
import { graphql, buildSchema, GraphQLResolveInfo } from 'graphql';

import './API';
import { User } from 'users';
import { assert, isType } from 'common';

import { getSiteInfo } from './Database';
import './Permissions';

const { router, log: Log } = as.core;

const schema = `
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

	type Query {
		info: Info!
		user: User!

		users: [User!]

		roles: [Role!]
		permissions: [Permission!]
		permissionCategories: [PermissionCategory!]

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
			as.users.permissions.has(permission),
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

as.dashboard = {
	internal: {
		schemaStrings: new Set([schema]),
		routeHandlers: [],

		async init() {
			this.schema = buildSchema([...this.schemaStrings.values()].join('\n'));

			as.dashboard.gqlResolver = {
				info: getSiteInfo(),
				user: (_: any, ctx: Ctx) => ({ ...ctx.user, permissions: ctx.permissions }),
				roles: (_: any, ctx: Ctx) => {
					const roles = [...as.users.roles.values()];
					if (
						!ctx.permissions.has('view_permissions') &&
						!ctx.permissions.has('administrator')
					) {
						roles.forEach((role: any) => ({ ...role, permissions: undefined }));
					}
					return roles;
				},
				permissions: gate(['view_permissions'], () => as.users.permissions.values()),
				permissionCategories: gate(['view_permissions'], () =>
					as.users.permissionCategories.values()
				),
				users: gate(['view_users'], () => as.users.listUsers()),
				createPasswordResetToken: gate(['administrator'], (ctx: any) =>
					as.users.createPasswordResetToken(ctx.identifier ?? '')
				)
			};

			this.routeHandlers.push(
				router.get('/dashboard/res/main.js', (_, res) => {
					res.sendFile(path.join(__dirname, '..', 'dist', 'main.js'));
				})
			);

			this.routeHandlers.push(
				router.get('/dashboard/res/main.js.map', (_, res) => {
					res.sendFile(path.join(__dirname, '..', 'dist', 'main.js.map'));
				})
			);

			this.routeHandlers.push(
				router.post('/dashboard/res/auth', async (req, res) => {
					try {
						assert(
							isType(req.body.identity, 'string') && isType(req.body.password, 'string'),
							'Missing required information.'
						);

						const token = await as.users.getAuthToken(
							req.body.identity,
							req.body.password
						);

						res.send(token);
					} catch (e) {
						if ((e as Error).name === 'AssertError') {
							res.status(401).send((e as Error).message);
						} else {
							Log.warn('Unhandled error in auth handler: ', e);
							res.sendStatus(400);
						}
					}
				})
			);

			this.routeHandlers.push(
				router.post('/dashboard/res/reset_password', async (req, res) => {
					try {
						assert(isType(req.body.token, 'string') && isType(req.body.password, 'string'),
							'Missing required information');

						res.send(await as.users.resetPassword(req.body.token, req.body.password));
					} catch (e) {
						if ((e as Error).name === 'AssertError') {
							res.status(401).send((e as Error).message);
						} else {
							Log.warn('Unhandled error in auth handler: ', e);
							res.sendStatus(400);
						}
					}
				})
			);

			this.routeHandlers.push(
				router.post('/dashboard/res/gql', async (req, res) => {
					try {
						const token = req.headers.token;
						assert(token && typeof token === 'string', 'Missing required information.');
						const user = as.users.getUser(token);
						const permissions = as.users.getRolePermissions(user.roles);

						res.send(
							await graphql({
								schema: this.schema!,
								source: req.body.query,
								variableValues: req.body.variables,
								rootValue: as.dashboard.gqlResolver,
								contextValue: { permissions, context: as.dashboard.gqlContext, user },
							})
						);
					} catch (e) {
						if ((e as Error).name === 'AssertError') {
							res.status(401).send((e as Error).message);
						} else {
							Log.warn('Unhandled error in gql handler: ', e);
							res.sendStatus(400);
						}
					}
				})
			);

			this.routeHandlers.push(
				router.get('/dashboard/res/:path', (req, res) => {
					res.sendFile(path.join(__dirname, '..', 'res', 'Dashboard', req.params.path));
				})
			);

			setTimeout(() => {
				const dashboardPlugins = [...as.core.plugins.values()].filter(
					(p) => p.entry.dashboard
				);

				for (const plugin of dashboardPlugins) {
					this.routeHandlers.push(
						router.get(`/dashboard/res/plugin/${plugin.identifier}`, (_, res) => {
							res.sendFile(
								path.join(
									__dirname,
									'..',
									'..',
									plugin.identifier,
									plugin.entry.dashboard
								)
							);
						})
					);
				}

				this.routeHandlers.push(
					router.get(['/dashboard', '/dashboard/*'], (_, res) => {
						res.status(200).send(trim`
						<!DOCTYPE html>
						<html lang='en' class='AS_APP dark'>
							<head>
								<meta charset='utf-8'/>
								<meta name='robots' content='noindex'/>
								<meta name='viewport' content='width=device-width'/>
								<title>Dashboard</title>
								<meta name='description' content='Website dashboard.'/>

								<script src='/dashboard/res/main.js' defer></script>
								${dashboardPlugins
									.map(
										(plugin) =>
											`<script src='/dashboard/res/plugin/${plugin.identifier}' defer></script>`
									)
									.join('\n')}
							</head>
							<body id='root'>
							</body>
						</html>`);
					})
				);
			});
		},

		cleanup() {
			this.routeHandlers.forEach((handler) => router.remove(handler));
			// this.schemaStrings = new Set();
			// as.dashboard.gqlContext = {};
			// as.dashboard.gqlResolver = {};
		},
	},

	gqlResolver: {},
	gqlContext: {},

	extendGQLSchema(schema: string) {
		this.internal.schemaStrings.add(schema);
		this.internal.cleanup();
		this.internal.init();

		return () => {
			this.internal.schemaStrings.delete(schema);
			this.internal.cleanup();
			this.internal.init();
		};
	},
};

setImmediate(() => as.dashboard.internal.init());
as.core.once('cleanup', () => as.dashboard.internal.cleanup());
