import { NodeType, Schema } from 'prosemirror-model';
import { inputRules, wrappingInputRule, textblockTypeInputRule,
	smartQuotes, emDash, ellipsis } from 'prosemirror-inputrules';

import { SpecOptions } from '.';

export function blockQuoteRule(nodeType: NodeType) {
	return wrappingInputRule(/^\s*>\s$/, nodeType)
}

export function orderedListRule(nodeType: NodeType) {
	return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
		(match, node) => node.childCount + node.attrs.order === +match[1]);
}

export function bulletListRule(nodeType: NodeType) {
	return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

export function codeBlockRule(nodeType: NodeType) {
	return textblockTypeInputRule(/^```$/, nodeType)
}

export function headingRule(nodeType: NodeType, offset: number, max: number) {
	return textblockTypeInputRule(new RegExp(`^(#{1,${max}})\\s$`),
		nodeType, match => ({ level: match[1].length - 1 + offset }))
}

export default function InputRules(options: SpecOptions, schema: Schema) {
	const rules = smartQuotes.concat(ellipsis, emDash);

	if (options.allowedNodes.includes('blockquote'))
		rules.push(blockQuoteRule(schema.nodes.blockquote))
	if (options.allowedNodes.includes('list'))
	rules.push(orderedListRule(schema.nodes.ordered_list))
	if (options.allowedNodes.includes('list'))
		rules.push(bulletListRule(schema.nodes.bullet_list))
	if (options.allowedNodes.includes('codeblock'))
		rules.push(codeBlockRule(schema.nodes.codeblock))
	if (options.numHeadings > 0)
	rules.push(headingRule(schema.nodes.heading, 0, options.numHeadings))

	return inputRules({ rules });
}
