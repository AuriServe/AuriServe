import { assert } from "common";
import OrderedMap from 'orderedmap';
import { addListNodes } from 'prosemirror-schema-list';
import { MarkSpec, NodeSpec, ParseRule, Schema } from "prosemirror-model";

import { range } from "../common/Util";

const ALLOWED_INLINE_MARK_TAGS = [
	'code',
	'em',
	'q',
	'span',
	'strong',
	'sub',
	'sup',
] as const;

export interface CustomStyle {
	baseTag: typeof ALLOWED_INLINE_MARK_TAGS[number];
	class: string;
	split?: boolean;
}

export interface SpecOptions {
	forceTitle?: boolean;
	numHeadings?: number;
	titleLevel?: number;
	headingsLevelStart?: number;
	customStyles?: CustomStyle[];
}


export default function makeSchema(options: SpecOptions) {
	const {
		forceTitle = false,
		numHeadings = 5,
		titleLevel = forceTitle ? 1 : 0,
		headingsLevelStart = titleLevel + 1,
		customStyles = []
	} = options;

	assert(headingsLevelStart > titleLevel,
		'`headingsLevelStart` must be greater than `titleLevel` if specified.');

	const customStylesByTag: Record<string, CustomStyle[]> = {}
	for (const mark of customStyles) customStylesByTag[mark.baseTag] =
		(customStylesByTag[mark.baseTag] ?? []).concat([ mark ]);

	// function customStyleNode(
	// 	tag: string, customStyles: CustomStyle[] | undefined, defaultParseRules: ParseRule[] = []): NodeSpec | null {

	// 	const rules = (customStyles ?? []).filter(s => s.split);
	// 	if (rules.length === 0) return null;

	// 	return {
	// 		attrs: {
	// 			class: { default: '' }
	// 		},
	// 		inline: true,
	// 		content: 'text*',
	// 		marks: '',
	// 		group: 'custom_style_node inline',
	// 		parseDOM: [
	// 			...rules.map(rule => ({ tag: `${rule.baseTag}[class='${rule.class}']`, attrs: { class: rule.class } })),
	// 			...defaultParseRules
	// 		],
	// 		toDOM: (node) => {
	// 			console.log(node)
	// 			return [ tag, { class: node.attrs.class || undefined, 'data-node': true },
	// 				[ 'span', 0 ],
	// 				[ 'span', { contentEditable: false }, (node.content as any)?.content?.[0]?.text ] ];
	// 		}
	// 	};
	// }

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

		blockquote: {
			content: 'block+',
			group: 'block',
			defining: true,
			parseDOM: [{ tag: 'blockquote' }],
			toDOM: () => { return [ 'blockquote', 0 ]; }
		},

		horizontal_rule: {
			group: 'block',
			parseDOM: [{ tag: 'hr' }],
			toDOM: () => { return [ 'hr' ]; }
		},

		title: forceTitle ? {
			content: 'inline*',
			defining: true,
			parseDOM: [{ tag: `h${titleLevel}` }],
			toDOM(node) { return [ `h${titleLevel}`, { class: node.nodeSize === 1 ? 'empty' : '' }, 0 ]; }
		} : null,

		heading: {
			attrs: { level: { default: 0 } },
			content: 'inline*',
			group: 'block',
			defining: true,
			parseDOM: [ ...range(numHeadings).map(l => ({ tag: (l + headingsLevelStart <= 6) ?
					`h${l + headingsLevelStart}` : `h6[aria-level=${l + headingsLevelStart}]`, attrs: { level: l } }))
			],
			toDOM({ attrs: { level: l } }) { return [
				`h${Math.min(l + headingsLevelStart, 6)}`,
				{ 'aria-level': l + headingsLevelStart < 6 ? undefined : l + headingsLevelStart }, 0 ]; }
		},

		code_block: {
			content: 'text*',
			marks: '',
			group: 'block',
			code: true,
			defining: true,
			parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
			toDOM: () => { return [ 'pre', [ 'code', 0 ] ]; }
		},

		text: {
			group: 'inline'
		},

		image: {
			inline: true,
			attrs: {
				src: {},
				alt: { default: null }
			},
			group: 'inline',
			draggable: true,
			parseDOM: [{ tag: 'img[src]', getAttrs(dom) {
				return {
					src: (dom as HTMLElement).getAttribute('src'),
					alt: (dom as HTMLElement).getAttribute('alt')
				};
			} }],
			toDOM(node) { return [ 'img', node.attrs ]; }
		},

		hard_break: {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM: () => { return [ 'br' ]; }
		},

		// styled_code: customStyleNode('code', customStylesByTag.code),
		// styled_em: customStyleNode('em', customStylesByTag.em),
		// styled_q: customStyleNode('q', customStylesByTag.q),
		// styled_span: customStyleNode('span', customStylesByTag.span),
		// styled_strong: customStyleNode('strong', customStylesByTag.strong),
		// styled_sub: customStyleNode('sub', customStylesByTag.sub),
		// styled_sup: customStyleNode('sup', customStylesByTag.sup)
	} as Record<string, NodeSpec | null>).filter(([ _, v ]) => v != null)) as Record<string, NodeSpec>;

	function customStyleMark(
		tag: string, customStyles: CustomStyle[] | undefined, defaultParseRules: ParseRule[] = []): MarkSpec {

		// const defaultTag = defaultParseRules.find(p => p.tag === tag && Object.entries(p).length === 1);
		// if (defaultTag) {
		// 	const allSliced = (customStyles ?? []).filter(s => s.split).map(s => s.class);
		// 	defaultTag.tag = `${tag}${allSliced.map(s => `:not([class=${s}])`).join('')}`;
		// 	console.log(defaultTag);
		// }

		return {
			attrs: {
				class: { default: '' }
			},
			parseDOM: [
				...(customStyles ?? [])
					// .filter(style => !style.split)
					.map(mark =>
					({ tag: `${mark.baseTag}[class='${mark.class}']`, attrs: { class: mark.class } })) ?? [],
				...defaultParseRules,
			],
			toDOM: (node) => {
				return [ tag, { class: node.attrs.class || undefined }, 0 ];
			},
			split: Object.fromEntries((customStyles ?? []).map(s => [ s.class, s.split ]).filter(([ _, s ]) => s))
		};
	}

	const marks: Record<typeof ALLOWED_INLINE_MARK_TAGS[number], MarkSpec> = ({
		// TODO: LINK

		code: customStyleMark('code', customStylesByTag.code, [ { tag: 'code' } ]),

		em: customStyleMark('em', customStylesByTag.em, [
			{ tag: 'i' },
			{ style: 'font-style=italic', attrs: { class: '' } },
			{ style: 'font-style=normal', clearMark: m => m.type.name === 'em' },
			{ tag: 'em', attrs: { class: '' } },
		]),

		q: customStyleMark('q', customStylesByTag.q, [ { tag: 'q' } ]),

		span: customStyleMark('span', customStylesByTag.span),

		strong: customStyleMark('strong', customStylesByTag.strong, [
			{ tag: 'strong' },
			// Google docs correction, see `prosemirror-schema-basic`
			{ tag: 'b', getAttrs: (node) => (node as HTMLElement).style.fontWeight !== 'normal' && null },
			{ style: 'font-weight=400', clearMark: m => m.type.name === 'strong' },
			{ style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null },
		]),

		sub: customStyleMark('sub', customStylesByTag.sub, [ { tag: 'sub' } ]),

		sup: customStyleMark('sup', customStylesByTag.sup, [ { tag: 'sup' } ]),
	});

	console.log(nodes);
	console.log(marks);

	return new Schema({
		nodes: addListNodes(OrderedMap.from(nodes), 'paragraph block*', 'block'),
		marks
	});
}
