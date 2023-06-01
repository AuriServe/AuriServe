import { z } from 'zod';

export const ConfigSchema = z.object({
	port: z.preprocess((v: any) => Number.parseInt(v, 10), z.number().default(80)),
	dataPath: z.string().default('.'),
	debug: z.preprocess((v: any) => !!v, z.boolean().default(false)),
	logLevel: z.string().default('info')
}).passthrough();

export type Config = z.infer<typeof ConfigSchema>;


