import { MarkSpec, ParseRule } from "prosemirror-model";

export const ALLOWED_TEXT_STYLE_TAGS = [
	'code',
	'em',
	'q',
	'span',
	'strong',
	'sub',
	'sup',
] as const;

/**
 * Represents a possible text style that can be applied to a range of text.
 * Internally, an inline mark with a class is used to render these styles.
 */

export default interface TextStyle {
	/** The base semantic tag for this style. Should be appropriate for the style's presentation. */
	baseTag: typeof ALLOWED_TEXT_STYLE_TAGS[number];

	/** The class that this style should have, which is used to style its appearance. */
	class: string;

	/** Whether or not text using this style should have each letter wrapped in a <s> tag. */
	split?: boolean;

	/** The friendly label for this style, for use by the editor. */
	label?: string;

	/** Whether or not the style excludes all other marks from being used within it. */
	exclusive?: boolean;
}

export const DEFAULT_TEXT_STYLES: TextStyle[] = [
	{ baseTag: 'strong', class: '', label: 'Bold' },
	{ baseTag: 'em', class: '', label: 'Italic' },
	{ baseTag: 'em', class: 'underline', label: 'Underline' },
	{ baseTag: 'code', class: '' },
];

export function createdStyledMark(
	tag: string, styles: TextStyle[] = [], defaultParseRules: ParseRule[] = []): MarkSpec {

	const parseRules: ParseRule[] = [
		...(styles ?? [])
			// .filter(style => !style.split)
			.map(style =>
			({ tag: `${style.baseTag}.${style.class}`, attrs: { class: style.class } })) ?? [],
		...defaultParseRules,
	].map(rule => {
		if (rule.tag === `${tag}.`)
			rule.tag = `${tag}${styles.filter(s => s.class).map(s => `:not([class=${s.class}])`).join('')}`;
		return rule;
	});

	const split = Object.fromEntries((styles ?? []).map(s => [ s.class, s.split ]).filter(([ _, s ]) => s));
	return {
		attrs: {
			class: { default: '' }
		},
		excludes: '_',
		parseDOM: parseRules,
		toDOM: (node) => {
			return [ tag, { class: [ node.attrs.class || undefined,
				split[node.attrs.class] ? 'split' : undefined ].filter(Boolean).join(' ')  }, 0 ];
		},
		split
	};
}

// function createStyledNode(
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
// 		atom: false,
// 		group: 'custom_style_node inline',
// 		parseDOM: [
// 			// ...rules.map(rule => ({ tag: `${rule.baseTag}[class='${rule.class}']`, attrs: { class: rule.class } })),
// 			...defaultParseRules
// 		],
// 		toDOM: (node) => {
// 			console.log(node)
// 			return [ tag, { class: node.attrs.class || undefined, 'data-node': true },
// 				[ 'span', 0 ] ];
// 		}
// 	};
// }
