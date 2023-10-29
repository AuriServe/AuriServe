import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function applyDecorations(doc: Node, _lazy: boolean) {
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		node.marks.forEach((mark) => {;
			if (!mark.type.spec.split?.[mark.attrs.class]) return;
			const text = node.text as string;

			for (let i = 0; i < text.length; i++) {
				let char = text[i];
				if (char === '\'') char = '\\\'';
				if (char === '\\') char = '\\\\';
				decorations.push(Decoration.inline(pos + i, pos + i + 1, {
					class: '', style: `${text[i].trim() === '' ? 'white-space: break-spaces;' : `--c:'${char}';--i:${i}`}`
				}));
			}
		});
	});
	return DecorationSet.create(doc, decorations);
}

export interface SplitDecorationOptions {
	lazy?: boolean;
}

export default function SplitDecorationPlugin({ lazy }: SplitDecorationOptions) {
	return new Plugin({
		state: {
			init: (_, { doc }) => applyDecorations(doc, lazy ?? false),
			apply: (tr, old) => tr.docChanged ? applyDecorations(tr.doc, lazy ?? false) : old,
		},
		props: {
			decorations(state) { return this.getState(state) }
		},
	});
}
