import { z } from 'zod';
import { Version } from 'common';

export const ManifestSchema = z.object({
	name: z.string().default(''),
	identifier: z.string(),
	description: z.string().default(''),
	icon: z.string().optional(),

	author: z.string(),
	version: z.string().transform(v => new Version(v)),
	depends: z.record(z.string()).default({}),

	entry: z.union([ z.string().transform(server => ({ server })), z.record(z.string()) ]).default({}),
	watch: z.string().array().default([])
}).passthrough().transform(manifest => {
	manifest.watch = [ ...new Set([ ...(manifest.watch ?? []), ...Object.values(manifest.entry) ]) ];
	return manifest;
});

export type Manifest = z.infer<typeof ManifestSchema>;


