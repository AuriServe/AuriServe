import { traversePath, convertColor, Color } from 'common';

function colorToFormat(color: Color, format: string): string {
	let formattedColor;

	switch (format) {
		case 'rgb': {
			const rgba = convertColor(color, 'rgba');
			formattedColor = `${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(
				rgba.b
			)}`;
			break;
		}
		case 'hsv': {
			const hsva = convertColor(color, 'hsva');
			formattedColor = `${hsva.h}, ${hsva.s}, ${hsva.v}`;
			break;
		}

		default:
		case 'hex': {
			formattedColor = convertColor(color, 'hex');
			break;
		}
	}

	return formattedColor;
}

interface Context {
	theme: any;
}

type ReplacerFunc = (ctx: Context, ...match: any[]) => string;

const directives: [RegExp, ReplacerFunc][] = [];

directives.push([
	/\/\*\s*@color-swatch(?:\(([a-z-.,\s]+)*\))*\s*\*\//gim,
	function colorSwatch(ctx, _, strArgs: string) {
		const [themePath, prop, rawFormat] = strArgs
			.split(',')
			.filter(Boolean)
			.map((arg: string) => arg.trim());

		const format = (rawFormat ?? 'hex') as 'rgb' | 'hsv' | 'hex';

		const colors = traversePath(ctx.theme, themePath) as { [key: number]: Color };
		return Object.entries(colors)
			.map(([weight, color]) => `${prop}-${weight}: ${colorToFormat(color, format)};`)
			.join('\n');
	},
]);

directives.push([
	/\/\*\s*@theme(?:\(([a-z-.,\s]+)*\))*\s*\*\//gim,
	function theme(ctx, _, strArgs) {
		const [themePath, format] = strArgs
		.split(',')
		.filter(Boolean)
		.map((arg: string) => arg.trim());

		let value;
		try {
			value = traversePath(ctx.theme, themePath);
		} catch (e) {
			console.log(`Couldn't find theme value '${themePath}'`);
			return 'INVALID_THEME_VALUE';
		}

		if (format) {
			const parsedFormat = (format ?? 'hex') as 'rgb' | 'hsv' | 'hex';
			return colorToFormat(value, parsedFormat);
		}

		return value.toString();
	},
]);

directives.push([
	/(\/\*\s*@if\s*\([\sa-z.,\-=&|_'"]+\)\s*\*\/(?:(?:.|\r|\n)*?\/\*\s*@(?:else ?if\s*\([a-z., ]+\)|else)\s\*\/)*(.|\r|\n)*?\/\*\s*@end ?if\s*\*\/)/gim,
	(ctx, match) => {
		const blocks: string[][] = [];
		const regex =
			/\/\*\s*@(if|else(?: ?if)?)\s*(?:\(([\sa-z_.,\-=&|!_'"]+)\))?\s*\*\/((?:.|\r|\n)*?)(?=\/\*\s*@(?:if|else(?: ?if)?|end ?if)\s*(?:\([\sa-z_.,\-=&|!_'"]+\))?)/gim;
		for (;;) {
			const block = regex.exec(match);
			if (!block) break;
			blocks.push(block.slice(1));
		}

		for (const [rule, args, content] of blocks) {
			if (rule === 'else') return content;
			else if (
				(args as string)
					.replace(/\s/g, '')
					.split('&&')
					.every((arg) => {
						const [path, wanted] = arg.split(/(?:==|!=)/g);
						const eq = arg.includes('==');
						try {
							const val = traversePath(ctx.theme, path);
							if (eq) return val === wanted;
							return val !== wanted;
						} catch (e) {
							console.log(args);
							return false;
						}
					})
			) {
				return content;
			}
		}

		return '';
	},
]);

export default function parseCSS(css: string, theme: any) {
	directives.forEach(
		([regex, replacer]) =>
			(css = css.replace(regex, (...match) => {
				return replacer({ theme }, ...match)
			}))
	);
	return css;
}
