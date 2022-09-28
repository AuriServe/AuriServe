import path from 'path';
import sizeOf from 'image-size';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

export interface Preset {
	identifier: string;
	maxSize?: number;
	options?: Record<string, string | number | boolean>;
}

export const presets: Preset[] = [
	{
		identifier: 'full',
		options: { q: 80 }
	},
	{
		identifier: 'lg',
		maxSize: 1920,
		options: { q: 80 }
	},
	{
		identifier: 'md',
		maxSize: 960,
		options: { q: 80 }
	},
	{
		identifier: 'sm',
		maxSize: 480,
		options: { q: 80 }
	},
	{
		identifier: 'load',
		maxSize: 32,
		options: { size: 1024, noalpha: true }
	}
]

export function execCWebP(input: string, output: string, options: string) {
	return new Promise<string>((resolve, reject) => {
		fs.unlink(output).catch(() => {/* we don't care if the file exists. */}).finally(() =>
			exec(`cwebp ${options} "${input.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"\
				-o "${output.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"`, (err) => {
				if (err) reject(err);
				else resolve(output);
			})
		);
	});
}

export function scaleTo(width: number, height: number, max: number): { width: number, height: number }{
	const ratio = Math.max(Math.max(width, height) / max, 1);
	return { width: Math.floor(width / ratio), height: Math.floor(height / ratio) };
}

export function generatePreset(input: string, preset: Preset,
	outputDir?: string, baseSize?: { width: number, height: number }) {

	let options = '';

	if (preset.maxSize) {
		baseSize ??= sizeOf(input) as { width: number, height: number };
		const size = scaleTo(baseSize.width, baseSize.height, preset.maxSize);
		options += `-resize ${size.width} ${size.height} `;
	}

	for (const [ key, value ] of Object.entries(preset.options ?? {})) {
		if (value === true) options += `-${key} `;
		else options += `-${key} ${value} `;
	}

	const parsedPath = path.parse(input);

	const output = `${outputDir ?? parsedPath.dir}/${parsedPath.name}.${preset.identifier}.webp`;
	return execCWebP(input, output, options);
}

export async function generateAllPresets(input: string, outputDir?: string) {
	const baseSize = sizeOf(input) as { width: number, height: number };
	return Object.fromEntries(await Promise.all(presets.map(async preset =>
		[ preset.identifier, await generatePreset(input, preset, outputDir, baseSize) ]))) as Record<string, string>;
}
