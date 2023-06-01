import { h, Fragment } from 'preact';
import { merge } from 'common';

import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';

interface Props {
	content?: string;

	style?: any;
	class?: string;
}

const identifier = 'base:text';

export function Text(props: Props) {
	const editor = useEditor({
		extensions: [StarterKit],
		editorProps: { attributes: { class: 'element-prose' } },
		content: props.content ?? ''
	});

	return (
		<Fragment>
			<EditorContent editor={editor} className={merge(identifier, props.class)} style={props.style} />
		</Fragment>
	);
}

export default { identifier, component: Text };
