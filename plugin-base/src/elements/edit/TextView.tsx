import Quill from 'quill';
import * as Preact from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { AdminDefinition } from 'auriserve-api';

import { server } from '../TextView';

import './TextView.sss';

const ICONS: { [ key: string ]: string } = {
	'header-1': require('../../../res/format-header-1.svg'),
	'header-2': require('../../../res/format-header-2.svg'),
	'header-3': require('../../../res/format-header-3.svg'),
	'header-4': require('../../../res/format-header-4.svg'),
	'header-5': require('../../../res/format-header-5.svg'),
	'header-6': require('../../../res/format-header-6.svg'),

	'bold': require('../../../res/format-bold.svg'),
	'italic': require('../../../res/format-italic.svg'),
	'underline': require('../../../res/format-underline.svg'),
	'strike': require('../../../res/format-strike.svg'),
	'code': require('../../../res/format-code.svg'),

	'link': require('../../../res/format-link.svg'),
	
	'code-block': require('../../../res/format-code-block.svg'),
	'blockquote': require('../../../res/format-blockquote.svg'),
	'list': require('../../../res/format-list.svg')
};

interface Props {
	props: {
		content: string;
		class?: string;
		style?: any;
	};

	setProps: (object: any) => void;
}

interface Refs {
	root: HTMLDivElement | null;
	body: HTMLDivElement | null;
	toolbar: HTMLDivElement | null;
}

function FormatButton({ operation, value }: { operation: string; value?: any }) {
	const prevent = (evt: any) => evt.preventDefault();

	return (
		<button onMouseDown={prevent} class={`EditTextView-FormatButton ql-${operation}`}
			value={value} aria-label={operation}>
			<img src={ICONS[operation + (value ? '-' + value : '')]} alt='' role='presentation'/>
		</button>
	);
}

function EditTextView({ props, setProps }: Props) {
	const editorRef = useRef<Quill | null>(null);
	const refs = useRef<Refs>({} as any);

	useEffect(() => {
		if (!refs.current.toolbar || !refs.current.body) return;
		let editor = new Quill(refs.current.body, {
			modules: { toolbar: { container: refs.current.toolbar } }
		});
		editor.root.innerHTML = props.content;
		editorRef.current = editor;

		editor.on('text-change', () => setProps({ content: editor.root.innerHTML }));
	}, []); // eslint-disable-line

	return (
		<div class='TextView EditTextView' ref={root => refs.current.root = root}>
			<div class='EditTextView-Body' ref={body => refs.current.body = body}/>
			<div class='EditTextView-Toolbar'
				ref={toolbar => refs.current.toolbar = toolbar}>
				<FormatButton operation='header' value={1}/>
				<FormatButton operation='header' value={2}/>
				<FormatButton operation='header' value={3}/>
				<FormatButton operation='header' value={4}/>
				<FormatButton operation='header' value={5}/>
				<FormatButton operation='header' value={6}/>

				<div class='EditTextView-FormatSeparator'/>

				<FormatButton operation='bold'/>
				<FormatButton operation='italic'/>
				<FormatButton operation='underline'/>
				<FormatButton operation='strike'/>
				<FormatButton operation='code'/>

				<div class='EditTextView-FormatSeparator'/>

				<FormatButton operation='link'/>

				<div class='EditTextView-FormatSeparator'/>

				<FormatButton operation='code-block'/>
				<FormatButton operation='blockquote'/>
				<FormatButton operation='list'/>
			</div>
		</div>
	);
};

export const admin: AdminDefinition = {
	...server,
	editing: {
		propertyEditor: false,
		inlineEditor: EditTextView
	}
};
