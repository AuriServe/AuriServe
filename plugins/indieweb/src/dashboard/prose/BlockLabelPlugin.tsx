import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function applyDecorations(doc: Node) {
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		if (node.isInline) return;

		// Decoration.widget()
		decorations.push(Decoration.widget(pos + node.nodeSize - 1, () => {
			const wrapper = document.createElement('div');
			wrapper.classList.add('block_label');
			wrapper.contentEditable = 'false';
			const button = document.createElement('button');
			button.innerText = node.type.name;
			wrapper.appendChild(button);
			return wrapper;
		}, {
			// side: 1,
			ignoreSelection: true,
			side: 1,

			stopEvent: () => true
		}));
	});
	return DecorationSet.create(doc, decorations);
}

export default function BlockLabelPlugin() {
	return new Plugin({
		state: {
			init: (_, { doc }) => applyDecorations(doc),
			apply: (tr, old) => tr.docChanged ? applyDecorations(tr.doc) : old,
		},
		props: {
			decorations(state) { return this.getState(state) }
		},
	});
}
