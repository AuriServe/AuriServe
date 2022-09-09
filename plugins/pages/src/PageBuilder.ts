import { log } from 'auriserve';
import { assert } from 'common';
import escapeHtml from 'escape-html';
import { renderTree } from 'elements';

import { getDocument } from './Database';
import { registeredLayouts } from './Layouts';
import { registeredInjectors } from './Injectors';
import { Document, PageDocument, isIncludeNode, Node, isIncludeDocument } from './Interface';

const getSectionRegex = (section: string) => {
	return new RegExp(
		`(?<start><(?<tag>[A-z1-9]+)(?: +[A-z1-9-]+(?:=(?:(?<d1>['']).*?(?<!\\\\)\\k<d1>))*)*? +(?:data-include)(?:=(?<value>(?<q>[''])${section}(?<!\\\\)\\k<q>))*(?: +[A-z1-9-]+(?:=(?:(?<d2>['']).*?(?<!\\\\)\\k<d2>))*)*?\\/?>)(\\s*)(?<end><\\/\\k<tag>>)`,
		'gi'
	);
};

export async function buildPage(page: PageDocument): Promise<string> {
	const perfName = `Building page '${page.metadata.title ?? 'Untitled'}'`;

	function resolveIncludes(node: Node, includeProps: Record<string, Record<string, any>> = {}): void {
		while (isIncludeNode(node)) {
			const include: Document | null = getDocument(node.include);
			assert(include && isIncludeDocument(include), `Included document '${node.include}' doesn't exist.`);
			delete (node as any).include;
			if (node.props) includeProps = { ...includeProps, ...node.props };
			delete (node as any).props;
			for (const [ k, v ] of Object.entries(include.content)) (node as any)[k] = v;
		}

		if (node.exposeAs) {
			node.props = { ...node.props, ...includeProps[node.exposeAs] ?? {} };
			delete includeProps[node.exposeAs];
		}

		for (const children of Object.values((Array.isArray(node.children) ? { _: node.children } : node.children) ?? {})) {
			for (const child of children) {
				resolveIncludes(child, includeProps);
			}
		}
	}

	for (const section of Object.values(page.content.sections)) resolveIncludes(section);

	log.perfStart(perfName);

	const [injectHead, injectBodyStart, injectBodyEnd, populatedLayout] =
		await Promise.all([
			Promise.all(
				[...registeredInjectors.head].map((injector) => injector())
			).then((res) => res.join('\n')),
			Promise.all(
				[...registeredInjectors.body_start].map((injector) => injector())
			).then((res) => res.join('\n')),
			Promise.all(
				[...registeredInjectors.body_end].map((injector) => injector())
			).then((res) => res.join('\n')),
			populateLayout(page.content.layout ?? 'default', page.content.sections),
		]);

	const html = `
	<!DOCTYPE html>
	<html lang='en'>
		<head>
			<meta charset='utf-8'/>
			<meta name='description' content='${escapeHtml(page.metadata.description)}'>
			<meta name='viewport' content='width=device-width, initial-scale=1'>
			${page.metadata.index === false ? `<meta name='robots' content='noindex'>` : ''}
			<title>${escapeHtml(page.metadata.title)}</title>
			${injectHead}
		</head>
		<body id='page'>
			${injectBodyStart}
			${populatedLayout}
			${injectBodyEnd}
		</body>
	</html>`;

	log.perfEnd(perfName);
	return html;
}

export async function populateLayout(identifier: string, sections: Record<string, Node>): Promise<string> {
	let layout = registeredLayouts.get(identifier);
	assert(layout, `Layout '${identifier}' not found.`);

	const sectionContents: Record<string, string> = {};

	await Promise.all(
		Object.entries(sections).map(async ([key, section]) => {
			const contents = await renderTree(section as any);
			sectionContents[key] = contents;
		})
	);

	for (const section of Object.keys(sections)) {
		layout = layout.replace(
			getSectionRegex(section),
			`$<start>${sectionContents[section]}$<end>`
		);
	}

	return layout;
}
