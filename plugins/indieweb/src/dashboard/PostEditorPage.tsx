// import { FunctionalComponent, h } from 'preact';

// import BlogPostEditor from './BlogPostEditor';
// import UnknownPostEditor from './UnknownPostEditor';

// import { Post } from '../common/Type';

// interface Props {
// 	post: Post;
// }

// interface EditorProps {
// 	post: Post;
// 	// setFullscreen: (fullscreen: boolean) => void;
// }

// type PostEditorComponent = FunctionalComponent<EditorProps>;

// const POST_EDITORS: Record<string, PostEditorComponent> = {
// 	UNKNOWN: UnknownPostEditor,
// 	blog: BlogPostEditor
// }

// export default function PostEditorPage(props: Props) {
// 	const Editor = POST_EDITORS[props.post.type] ?? POST_EDITORS.UNKNOWN;

// 	return (
// 		<Editor post={props.post}/>
// 	)
// }
