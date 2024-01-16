import { assert } from "common";
import OrderedMap from 'orderedmap';
import { addListNodes } from 'prosemirror-schema-list';
import { MarkSpec, NodeSpec, Schema } from "prosemirror-model";

import { SpecOptions } from ".";
import TextStyle, { ALLOWED_TEXT_STYLE_TAGS, createdStyledMark } from "./TextStyle";
import { range } from "../../common/Util";

export const SUPPORTED_NODES = [
	'image',
	'anchor',
	'horizontal_rule',
	'blockquote',
	'list',
	'codeblock',
	'heading',
	'hard_break'
] as const;

export type SupportedNode = typeof SUPPORTED_NODES[number];

export const DEFAULT_SUPPORTED_NODES: SupportedNode[] = [
	...SUPPORTED_NODES
];

export default function makeSchema(options: SpecOptions) {
	const {
		forceTitle,
		numHeadings,
		titleLevel,
		headingsLevelStart,
		textStyles,
		allowedNodes,
		customNodes,
		customMarks
	} = options;

	assert(headingsLevelStart > titleLevel,
		'`headingsLevelStart` must be greater than `titleLevel` if specified.');

	const textStylesByTag: Record<string, TextStyle[]> = {}
	for (const style of textStyles) textStylesByTag[style.baseTag] =
		(textStylesByTag[style.baseTag] ?? []).concat([ style ]);

	const nodes = Object.fromEntries(Object.entries({
		doc: {
			content: 'title block+'
		},

		paragraph: {
			content: 'inline*',
			group: 'block',
			parseDOM: [{ tag: 'p' }],
			toDOM: () => { return [ 'p', 0 ]; }
		},

		blockquote: (allowedNodes.includes('blockquote') ? {
			content: 'block+',
			group: 'block',
			defining: true,
			parseDOM: [{ tag: 'blockquote' }],
			toDOM: () => { return [ 'blockquote', 0 ]; }
		} : null),

		horizontal_rule: (allowedNodes.includes('horizontal_rule') ? {
			group: 'block',
			parseDOM: [{ tag: 'hr' }],
			toDOM: () => { return [ 'hr' ]; }
		} : null),

		title: forceTitle ? {
			content: 'inline*',
			marks: '',
			defining: true,
			parseDOM: [{ tag: `h${titleLevel}` }],
			toDOM(node) { return [ `h${titleLevel}`, { class: node.nodeSize === 1 ? 'empty' : '' }, 0 ]; }
		} : null,

		heading: (numHeadings > 0 ? {
			attrs: { level: { default: 0 }, id: { default: '' } },
			content: 'inline*',
			group: 'block',
			defining: true,
			parseDOM: [
				...range(numHeadings).map(l => ({
					tag: (l + headingsLevelStart <= 6)
						? `h${l + headingsLevelStart}`
						: `h6[aria-level='${l + headingsLevelStart}']`,
					getAttrs(dom: HTMLElement) {
						return {
							level: dom.tagName.toLowerCase().startsWith('h')
								? Number.parseInt(dom.tagName.substring(1), 10) - headingsLevelStart
								: Number.parseInt(dom.getAttribute('aria-level') ?? '1') - headingsLevelStart,
							id: dom.getAttribute('id') ?? ''
						}
					}
				}))
			],
			toDOM({ attrs: { level: l, id } }) {
				return [
					`h${Math.min(l + headingsLevelStart, 6)}`,
					{
						'aria-level': l + headingsLevelStart <= 6 ? undefined : l + headingsLevelStart,
						id: id ? id : null
					}, 0
				];
			}
		} : null),

		codeblock: (allowedNodes.includes('codeblock') ? {
			content: 'text*',
			marks: '',
			group: 'block',
			code: true,
			defining: true,
			parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
			toDOM: () => { return [ 'pre', [ 'code', 0 ] ]; }
		} : null),

		text: {
			group: 'inline'
		},

		image: (allowedNodes.includes('image') ? {
			attrs: {
				src: {},
				alt: { default: '' }
			},
			group: 'block',
			draggable: true,
			parseDOM: [{ tag: 'img[src]', getAttrs(dom) {
				return {
					src: (dom as HTMLElement).getAttribute('src'),
					alt: (dom as HTMLElement).getAttribute('alt')
				};
			} }],
			toDOM(node) { return [ 'img', node.attrs ]; }
		} : null),

		hard_break: (allowedNodes.includes('hard_break') ? {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM: () => { return [ 'br' ]; }
		} : null),

		// styled_code: customStyleNode('code', customStylesByTag.code),
		// styled_em: customStyleNode('em', customStylesByTag.em),
		// styled_q: customStyleNode('q', customStylesByTag.q),
		// styled_span: customStyleNode('span', customStylesByTag.span),
		// styled_strong: customStyleNode('strong', customStylesByTag.strong),
		// styled_sub: customStyleNode('sub', customStylesByTag.sub),
		// styled_sup: customStyleNode('sup', customStylesByTag.sup)

		...customNodes
	} as Record<string, NodeSpec | null>).filter(([ _, v ]) => v != null)) as Record<string, NodeSpec>;

	const marks: Record<string, MarkSpec> = ({
		link: {
			attrs: {
				href: { default: '' },
				newTab: { default: false }
			},
			parseDOM: [{
				tag: 'a',
				getAttrs(node) {
					return { href: (node as HTMLElement).getAttribute('href'),
						newTab: (node as HTMLElement).getAttribute('target') === '_blank' }
				}
			}],
			toDOM(node: any) {
				return [ 'a', { href: node.attrs.href, target: node.attrs.newTab ? '_blank' : undefined }];
			}
		},

		code: createdStyledMark('code', textStylesByTag.code, [ { tag: 'code' } ]),

		em: createdStyledMark('em', textStylesByTag.em, [
			{ tag: 'i' },
			{ style: 'font-style=italic', attrs: { class: '' } },
			{ style: 'font-style=normal', clearMark: m => m.type.name === 'em' },
			{ tag: 'em', attrs: { class: '' } },
		]),

		q: createdStyledMark('q', textStylesByTag.q),

		span: createdStyledMark('span', textStylesByTag.span),

		strong: createdStyledMark('strong', textStylesByTag.strong, [
			{ tag: 'strong' },
			// Google docs correction, see `prosemirror-schema-basic`
			{ tag: 'b', getAttrs: (node) => (node as HTMLElement).style.fontWeight !== 'normal' && null },
			{ style: 'font-weight=400', clearMark: m => m.type.name === 'strong' },
			{ style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null },
		]),

		sub: createdStyledMark('sub', textStylesByTag.sub),

		sup: createdStyledMark('sup', textStylesByTag.sup),

		...customMarks
	});

	let nodesOrderedMap = OrderedMap.from(nodes);
	if (allowedNodes.includes('list')) nodesOrderedMap = addListNodes(nodesOrderedMap, 'paragraph block*', 'block');

	return new Schema({
		nodes: nodesOrderedMap,
		marks
	});
}
