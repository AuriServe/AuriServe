import { traversePath } from 'common';

interface Context {
	theme: any;
}

type ReplacerFunc = (ctx: Context, ...match: any[]) => string;

const directives: [RegExp, ReplacerFunc][] = [];

directives.push([
	/(<!--\s*@if\s*\([\sa-z.,\-=&|_'"]+\)\s*-->(?:(?:.|\r|\n)*?<!--\s*@(?:else ?if\s*\([a-z., ]+\)|else)\s-->)*(.|\r|\n)*?<!--\s*@end ?if\s*-->)/gim,
	(ctx, match) => {
		const blocks: string[][] = [];
		const regex =
			/<!--\s*@(if|else(?: ?if)?)\s*(?:\(([\sa-z_.,\-=&|!_'"]+)\))?\s*-->((?:.|\r|\n)*?)(?=<!--\s*@(?:if|else(?: ?if)?|end ?if)\s*(?:\([\sa-z_.,\-=&|!_'"]+\))?)/gim;
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

export default function parseHTML(css: string, theme: any) {
	directives.forEach(
		([regex, replacer]) =>
			(css = css.replace(regex, (...match) => replacer({ theme }, ...match)))
	);
	return css;
}
