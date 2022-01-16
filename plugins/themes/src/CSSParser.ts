import { traverse, to, Color } from 'common';
// import { promises as fs, constants as fsc } from 'fs';

function colorToFormat(color: Color, format: string): string {
	let formattedColor;

	switch (format) {
		case 'rgb': {
			const rgba = to(color, 'rgba');
			formattedColor = `${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(
				rgba.b
			)}`;
			break;
		}
		case 'hsv': {
			const hsva = to(color, 'hsva');
			formattedColor = `${hsva.h}, ${hsva.s}, ${hsva.v}`;
			break;
		}

		default:
		case 'hex': {
			formattedColor = to(color, 'hex');
			break;
		}
	}

	return formattedColor;
}

interface Context {
	theme: any;
}

type ReplacerFunc = (ctx: Context, ...match: any[]) => string;

const directives: [RegExp, ReplacerFunc][] = [
	[
		/\/\*\s*@color-swatch(?:\(([a-z-.,\s]+)*\))*\s*\*\//gim,
		(ctx, _, strArgs: string) => {
			const [themePath, prop, rawFormat] = strArgs
				.split(',')
				.filter(Boolean)
				.map((arg: string) => arg.trim());

			const format = (rawFormat ?? 'hex') as 'rgb' | 'hsv' | 'hex';

			const colors = traverse(ctx.theme, themePath) as { [key: number]: Color };
			return Object.entries(colors)
				.map(([weight, color]) => `${prop}-${weight}: ${colorToFormat(color, format)};`)
				.join('\n');
		},
	],
	[
		/\/\*\s*@theme(?:\(([a-z-.,\s]+)*\))*\s*\*\//gim,
		(ctx, _, strArgs: string) => {
			const [themePath, rawFormat] = strArgs
				.split(',')
				.filter(Boolean)
				.map((arg: string) => arg.trim());
			const format = (rawFormat ?? 'hex') as 'rgb' | 'hsv' | 'hex';

			let color;
			try {
				color = traverse(ctx.theme, themePath);
			} catch (e) {
				console.log('FAIL');
				color = '#000';
			}

			return colorToFormat(color, format);
		},
	],
	[
		/(\/\*\s*@if\s*\([a-z., ]+\)\s*\*\/(?:(?:.|\r|\n)*?\/\*\s*@(?:else ?if\s*\([a-z., ]+\)|else)\s\*\/)*(.|\r|\n)*?\/\*\s*@end ?if\s*\*\/)/gim,
		(ctx, match) => {
			const blocks = [
				...match.matchAll(
					/\/\*\s*@(if|else ?if|else)\s*(?:\(([a-z., ]+)\))?\s*\*\/((?:.|\r|\n)*?)(?=\/\*\s*@(?:if|else ?if|else|end ?if)\s*(?:\([a-z., ]+\))?)/gim
				),
			];
			for (const [, rule, args, content] of blocks) {
				const match =
					rule === 'else'
						? true
						: (args as string)
								.split(',')
								.map((arg) => arg.trim())
								.every((optionPath) => traverse(ctx.theme, optionPath));
				if (match) {
					return content;
				}
			}
			return '';
		},
	],
];

export default function parseCSS(css: string, theme: any) {
	directives.forEach(
		([regex, replacer]) =>
			(css = css.replace(regex, (...match) => replacer({ theme }, ...match)))
	);
	return css;
}
