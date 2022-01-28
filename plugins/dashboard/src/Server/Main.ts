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

			this.routeHandlers.push(
				router.get(['/dashboard', '/dashboard/*'], (_, res) => {
					res.sendFile(path.join(__dirname, '..', 'res', 'Server', 'page.html'));
				})
			);
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
