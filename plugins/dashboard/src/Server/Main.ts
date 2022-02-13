import path from 'path';
import as from 'auriserve';
import { graphql, buildSchema } from 'graphql';

import './API';

const { router } = as.core;

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
		favicon: ID
		description: String!
	}

	type Query {
		info: Info!
	}
`;

function trim(templateArgs: TemplateStringsArray, ...args: any[]) {
	const strings = templateArgs
		.reduce((acc, str, i) => {
			acc += str;
			if (i < args.length) {
				acc += args[i];
			}
			return acc;
		}, '')
		.split('\n');

	let firstNonEmpty = -1;
	while (strings[++firstNonEmpty].trim() === '') {}

	const leadingWhitespace = strings[firstNonEmpty].match(/^\s+(?=\S)/)![0];
	const killRegex = new RegExp(`^${leadingWhitespace}`, 'gm');

	return strings.slice(firstNonEmpty).join('\n').replace(killRegex, '');
}

const resolver = {
	info: {
		name: 'The Shinglemill',
		domain: 'shinglemill.ca',
		description: 'hey there hey there',
		favicon: undefined,
	},
};

as.dashboard = {
	internal: {
		schemaStrings: new Set([schema]),
		routeHandlers: [],

		async init() {
			this.schema = buildSchema([...this.schemaStrings.values()].join('\n'));

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
				router.post('/dashboard/res/auth', (_, res) => {
					res.send('1234fakeToken4321');
				})
			);

			this.routeHandlers.push(
				router.post('/dashboard/res/gql', async (req, res) => {
					res.send(
						await graphql({
							schema: this.schema!,
							source: req.body.query,
							rootValue: as.dashboard.gqlResolver,
							contextValue: as.dashboard.gqlContext,
						})
					);
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
				console.log(dashboardPlugins);
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
			this.schemaStrings = new Set();
			as.dashboard.gqlContext = {};
			as.dashboard.gqlResolver = resolver;
		},
	},

	gqlResolver: resolver,
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

as.dashboard.internal.init();
as.core.once('cleanup', () => as.dashboard.internal.cleanup());
