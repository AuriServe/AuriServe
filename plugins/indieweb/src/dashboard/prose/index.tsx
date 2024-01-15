import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { buildKeymap } from 'prosemirror-example-setup';

import InputRules from './InputRules';
import BlockLabelPlugin from './BlockLabelPlugin';
import HeadingAnchorPlugin from './HeadingAnchorPlugin';
import VirtualCursorPlugin from './VirtualCursorPlugin';
import SplitDecorationPlugin from './SplitDecorationPlugin';
import SelectHighlightPlugin from './SelectHighlightPlugin';
import makeSchema, { DEFAULT_SUPPORTED_NODES, SupportedNode } from './Schema';
import TextStyle, { DEFAULT_TEXT_STYLES } from './TextStyle';
import SlashCommandsPlugins from './SlashCommandsPlugins';
import { RefObject } from 'preact';
import { AutocompleteAction } from 'prosemirror-autocomplete';

export interface SpecOptions {
	/** Whether or not this document should be forced to have a title heading. */
	forceTitle: boolean;

	/** The heading level of the title, if forceTitle is on. Defaults to 1 if `forceTitle`, 0 otherwise. */
	titleLevel: number;

	/** The number of allowed heading levels. Can be greater than six, but it is not recommended. */
	numHeadings: number;

	/** The highest heading level's level. Defaults to 2 if `titleLevel + 1`. */
	headingsLevelStart: number;

	/** Text styles to support in this editor. See `TextStyle`. */
	textStyles: TextStyle[];

	/** Allowed built-in nodes for this editor. Defaults to DEFAULT_SUPPORTED_NODES. */
	allowedNodes: SupportedNode[];

	/** Additional nodes to add to the node list. Not processed by `makeSchema`. */
	customNodes: Record<string, NodeSpec | null>;

	/** Additional marks to add to the mark list. Not processed by `makeSchema`. */
	customMarks: Record<string, MarkSpec | null>;

	/** Slash command hooks. */
	hooks: {
		commands: RefObject<(action: AutocompleteAction) => boolean>;
	}
}

/**
 * Populates a partial `SpecOptions` object with the default values.
 */

export function populateSpecOptions(options: Partial<SpecOptions>): SpecOptions {
	options.forceTitle ??= false;
	options.numHeadings ??= 5;
	options.titleLevel ??= options.forceTitle ? 1 : 0;
	options.headingsLevelStart ??= options.titleLevel + 1;
	options.textStyles ??= DEFAULT_TEXT_STYLES;
	options.allowedNodes ??= DEFAULT_SUPPORTED_NODES;
	options.customNodes ??= {};
	options.customMarks ??= {};
	return options as SpecOptions;
}

/**
 * Creates an opinionated schema and plugins for a ProseMirror editor based on a `SpecOptions`.
 */

export default function initialize(partialOptions: Partial<SpecOptions>): [ Schema, Plugin[] ] {
	const options = populateSpecOptions(partialOptions);
	const schema = makeSchema(options);

	const plugins: Plugin[] = [
		...SlashCommandsPlugins(partialOptions.hooks!),
		InputRules(options, schema),
		keymap(buildKeymap(schema)),
		keymap(baseKeymap),
		history(),
		// dropCursor(),
		// gapCursor(),
		SelectHighlightPlugin(),
		VirtualCursorPlugin({}),
		SplitDecorationPlugin({}),
		HeadingAnchorPlugin(),
		// BlockLabelPlugin(),
	];

	return [ schema, plugins ];
}
