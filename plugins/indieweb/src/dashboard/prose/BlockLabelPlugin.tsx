import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function applyDecorations(doc: Node) {
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		if (node.isInline) return;

		decorations.push(Decoration.widget(pos, (view, getPos) => {
			try {
				const button = document.createElement('button');
				let pos = getPos()!;

				let elem = view.coordsAtPos(pos, 1);
				// let { top, left } = elem.getBoundingClientRect();
				// top += window.scrollY;
				// console.log(pos);
				// left += window.scrollX;

				button.classList.add('block_button');
				button.contentEditable = 'false';
				button.innerText = node.type.name;
				button.style.top = `${elem.top}px`;
				// button.style.left = `${left}px`;
				// if (!pos) return button;

				// console.log(view.coordsAtPos(getPos()!));
				return button;
			}
			catch (e) {
				console.warn(e);
				return document.createElement('span');
			}

		}, {
			ignoreSelection: true,
			side: -1,
			stopEvent: () => true
		}));
	});
	return DecorationSet.create(doc, decorations);
}

export default function BlockLabelPlugin() {
	// return new Plugin({
	// 	state: {
	// 		init: (_, { doc }) => applyDecorations(doc),
	// 		apply: (tr, old) => tr.docChanged ? applyDecorations(tr.doc) : old,
	// 	},
	// 	props: {
	// 		decorations(state) { return this.getState(state) }
	// 	},
	// });
}
