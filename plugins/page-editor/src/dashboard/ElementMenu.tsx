import { h } from 'preact';
import { Menu, Icon } from 'dashboard';
import { useContext } from 'preact/hooks';

import { EditorContext } from './Editor';

interface Props {
	path: string;
	onClose: () => void;
	position?: { top: number; left: number };
}

export default function ElementMenu(props: Props) {
	const editor = useContext(EditorContext);

	const handleCut = () => {
		editor.copyNode(props.path);
		editor.removeNode(props.path);
	};

	return (
		<Menu active={!!props.position} position={props.position} onClose={props.onClose}>
			<Menu.Header>
				<Menu.Shortcut icon={Icon.widget_add} label='Add Element' />
				<Menu.Header.Spacer width={4} />
				<Menu.Shortcut
					icon={Icon.trash}
					label='Remove'
					onClick={() => editor.removeNode(props.path)}
				/>
			</Menu.Header>

			<Menu.Entry icon={Icon.cut} label='Cut' onClick={handleCut} />
			<Menu.Entry
				icon={Icon.copy}
				label='Copy'
				onClick={() => editor.copyNode(props.path)}
			/>

			<Menu.Entry
				icon={Icon.paste}
				label='Paste'
				disabled={!editor.clipboard}
				onClick={() => editor.pasteNode(props.path, 'over')}>
				<Menu.Shortcut
					icon={Icon.paste_before}
					label='Paste Before'
					disabled={!editor.clipboard}
					onClick={() => editor.pasteNode(props.path, 'before')}
				/>
				<Menu.Shortcut
					icon={Icon.paste_after}
					label='Paste After'
					disabled={!editor.clipboard}
					onClick={() => editor.pasteNode(props.path, 'after')}
				/>
			</Menu.Entry>

			{/* <Menu.Divider />

			<Menu.Entry icon={Icon.shortcut} label='Convert to'>
				<Menu.Entry icon={Icon.image} label='Image' />
				<Menu.Entry icon={Icon.image} label='Slideshow' />
				<Menu.Entry icon={Icon.image} label='Gallery' />
				<Menu.Entry icon={Icon.image} label='Album' />
			</Menu.Entry> */}
		</Menu>
	);
}
