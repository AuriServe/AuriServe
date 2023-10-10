import { h } from 'preact';
import { tw, css, merge } from 'dashboard';
import { EditorState, Plugin, } from 'prosemirror-state';
import { DOMParser, MarkType, Node } from 'prosemirror-model';
import { Decoration, DecorationSet, } from 'prosemirror-view';
import { exampleSetup } from 'prosemirror-example-setup';
import { ProseMirror } from '@nytimes/react-prosemirror';

import makeSchema from './Schema';
import { Post } from '../common/Type';
import { useState } from 'preact/hooks';
import { range } from '../common/Util';

interface Props {
	post: Post;
}

const editorSchema = makeSchema({
	forceTitle: true,
	titleLevel: 1,
	numHeadings: 5,
	customStyles: [
		{ baseTag: 'strong', class: 'jitter', split: true },
		{ baseTag: 'em', class: 'bounce', split: true },
		{ baseTag: 'em', class: 'gradient' }
	]
});

function applyDecorations(doc: Node) {
	const decorations: Decoration[] = [];
	doc.descendants((node, pos) => {
		if (node.marks.length) console.log(node);
		node.marks.forEach((mark) => {;
			if (!mark.type.spec.split?.[mark.attrs.class]) return;
			const from = pos;
			const to = pos + node.nodeSize;
			range(from, to).forEach((pos, i) => {
				decorations.push(Decoration.inline(pos, pos + 1,
					{ nodeName: 's', style: `--i: ${i}`, class: node.text?.[i] === ' ' ? 'space' : undefined }));
			});
		});
	});
	return DecorationSet.create(doc, decorations);
}

const decorationPlugin = new Plugin({
	state: {
		init: (_, { doc }) => applyDecorations(doc),
		apply: (tr) => applyDecorations(tr.doc)
	},
	props: {
		decorations(state) { return this.getState(state) }
	}
})

const examplePlugins = exampleSetup({ schema: editorSchema });
examplePlugins.push(decorationPlugin);

export default function BlogPostEditor({ post }: Props) {
	const [ mount, setMount ] = useState<HTMLElement | null>(null);
	const [ editorState, setEditorState ] = useState(() => {
		const container = document.createElement('div');
		container.innerHTML = `<h1>${post.data.title}</h1>${post.data.content}`;
		return EditorState.create({
			doc: DOMParser.fromSchema(editorSchema).parse(container),
			plugins: examplePlugins
		});
	});

	return (
		<div class={tw`w-full min-h-screen flex -mb-14`}>
			<aside class={tw`w-80 shrink-0 bg-gray-800 shadow-lg`}>
				<div class={tw`sticky top-0 p-8`}>
					<p>Outline</p>
				</div>
			</aside>

			<main class={tw`grow p-8`}>
				<ProseMirror
					mount={mount}
					state={editorState}
					dispatchTransaction={tr => setEditorState(s => s.apply(tr))}
				>
					<div ref={setMount} class={merge('PROSEMIRROR_VIEW', tw`
						w-full max-w-2xl mx-auto outline-0
						prose-(&)
						leading-8
						prose-headings:(text-gray-100)
						prose-p:(text-gray-200 my-4 font-[450])
						prose-strong:(text-gray-100)
						prose-pre:(text-gray-200)
						prose-code:(text-gray-200)
						prose-a:(text-accent-300 underline decoration-([5px] accent-300/20) no-decoration-skip underline-offset-[-2px])
						prose-hr:after:(!bg-gray-600 !h-0.5 !w-[90%] !mx-auto)
						prose-img:(rounded-xl mx-auto my-6 max-w-auto w-full)`)}
					/>
				</ProseMirror>
			</main>

			<aside class={tw`w-80 shrink-0 bg-gray-800 shadow-lg`}>
				<div class={tw`sticky top-0 p-8`}>
					<p>Meta</p>
				</div>
			</aside>
		</div>
	);
}
