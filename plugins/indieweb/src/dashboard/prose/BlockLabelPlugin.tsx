import { tw } from 'dashboard';
import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function applyDecorations(doc: Node) {
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		if (node.isInline) return;

		decorations.push(Decoration.widget(pos, () => {
			const wrapper = document.createElement('div');
			wrapper.classList.add(tw`~(relative)`);

			const button = document.createElement('button');
			button.classList.add(tw`~(absolute -left-4 -translate-x-full
				bg-gray-700 p-2 rounded font-mono text-(xs gray-300))`);
			button.contentEditable = 'false';
			button.innerText = node.type.name;

			wrapper.appendChild(button)
			return button;
		}, {
			ignoreSelection: true,
			side: -1,
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
