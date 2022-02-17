import { h } from 'preact';
import { tw } from 'dashboard';

// import { useContext } from 'preact/hooks';
// import { EditorContext } from '../Editor';
// import { traverse } from 'common';
// import { ElementContext } from '../Element';

interface Props {
	text: string;
}

export function Text(props: Props) {
	// const element = useContext(ElementContext);
	// const editor = useContext(EditorContext);

	// console.log(traverse(editor.page, element.path));
	return (
		<h1 class={tw`bg-gray-800/60 p-4 text-accent-300 font-bold text-7xl rounded`}>
			{props.text}
		</h1>
	);
}
