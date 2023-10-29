import { EditorState, Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function applyDecorations(state: EditorState) {

	const decorations: Decoration[] = [];
	const selections = state.selection.ranges;
	for (const range of selections) {
		decorations.push(Decoration.inline(range.$from.pos, range.$to.pos, {
			class: 'selection'
		}));
	}
	return DecorationSet.create(state.doc, decorations);
}

export default function SelectHighlightPlugin() {
	return new Plugin({
		state: {
			init: (_, state) => applyDecorations(state),
			apply: (tr, old, _, state) => applyDecorations(state),
		},
		props: {
			decorations(state) { return this.getState(state) }
		},
	});
}
