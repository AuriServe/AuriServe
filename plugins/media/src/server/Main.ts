import path from 'path';
import { assert } from 'common';
import auriserve, { router } from 'auriserve';

import { MEDIA_DIR, VARIANT_DIR, reconcileMedia } from './Ingest';
import { extendGQLSchema, gqlResolver } from 'dashboard';
import * as Database from './Database';

const cleanupWatcher = reconcileMedia();

const routes = [
	router.get('/media/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const modPath = path.join(MEDIA_DIR, file);
			res.sendFile(modPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	}),
	router.get('/media/variant/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const modPath = path.join(VARIANT_DIR, file);
			res.sendFile(modPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	})
];

extendGQLSchema(`
	type MediaVariant {
		id: Int!
		mid: Int!
		hash: String!
		path: String!
		size: Int!
		type: String!
		prop: Int!
		width: Int
		height: Int
	}

	type MediaItem {
		id: Int!
		name: String!
		description: String!
		type: String!
		canonical: Int!
		canonicalVariant: MediaVariant!
		variants: [MediaVariant!]!
	}

	type MediaQueryAPI {
		media(type: String): [MediaItem!]!
		mediaById(id: Int!): MediaItem
	}

	type MediaMutationAPI {
		_nothing: Int
	}

	extend type Query { media: MediaQueryAPI! }
	extend type Mutation { media: MediaMutationAPI! }
`);

gqlResolver.media = {
	media: (ctx: any) => {
		const media = Database.getAllMedia(ctx.type);
		return media.map(m => ({
			...m,
			canonicalVariant: Database.getCanonicalVariant(m.id, true),
			variants: Database.getMediaVariants(m.id, true)
		}));
	},
	mediaById: (ctx: any) => {
		const media = Database.getMedia(ctx.id);
		if (!media) return null;
		return {
			...media,
			canonicalVariant: Database.getCanonicalVariant(media.id, true),
			variants: Database.getMediaVariants(media.id, true)
		}
	}
}

auriserve.once('cleanup', () => {
	routes.forEach(route => router.remove(route));
	cleanupWatcher.then(c => c());
});

export * from './Database';
export * from '../dashboard/Main';
export { MEDIA_DIR, VARIANT_DIR } from './Ingest';
