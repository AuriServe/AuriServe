import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export function labelToAnchor(text: string, previousAnchors: string[]) {
	// const MAX_LEN = 64;
	let anchor = text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.replace(/(?:_)_+/g, '');

	if (previousAnchors.includes(anchor)) {
		let newAnchorInd = 1;
		while (previousAnchors.includes(`${anchor}_${newAnchorInd}`)) newAnchorInd++;
		anchor = `${anchor}_${newAnchorInd}`;
	}

	previousAnchors.push(anchor);
	return anchor;
}

function applyDecorations(doc: Node) {
	const anchors: string[] = [];
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		if (node.type.name !== 'heading') return;
		// console.log(node.type);

		const text = (node.textContent as string) ?? pos.toString();
		const anchor = labelToAnchor(text, anchors);

		decorations.push(Decoration.inline(pos, pos + node.nodeSize, {
			id: anchor
		}));
	});
	return DecorationSet.create(doc, decorations);
}

export default function HeadingAnchorPlugin() {
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
