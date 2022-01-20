import Quill from 'quill';
import { h, Fragment } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { AdminDefinition, EditProps } from 'plugin-api';

import { merge } from 'common/util';
import { useActiveState } from 'editor/hooks';
import { ComponentArea } from 'editor/components';

import { server, Props } from '../TextView';

import './TextView.sss';

const ICONS: { [ key: string ]: string } = {
	'header-2': require('../../../res/format-header-1.svg'),
	'header-3': require('../../../res/format-header-2.svg'),
	'header-4': require('../../../res/format-header-3.svg'),
	'header-5': require('../../../res/format-header-4.svg'),
	'header-6': require('../../../res/format-header-5.svg'),

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

interface Refs {
	body: HTMLDivElement | null;
	toolbar: HTMLDivElement | null;
}

function FormatButton({ operation, value }: { operation: string; value?: any }) {
	const prevent = (evt: any) => evt.preventDefault();

	return <button
		value={value}
		onMouseDown={prevent}
		aria-label={operation}
		class={'EditTextView-FormatButton ql-' + operation}>
		<img src={ICONS[operation + (value ? '-' + value : '')]} alt='' role='presentation'/>
	</button>;
}

export function EditTextView({ props, setProps }: EditProps<Props>) {
	const { hovered, active } = useActiveState();

	const refs = useRef<Refs>({} as any);
	const editorRef = useRef<Quill | null>(null);

	useEffect(() => {
		if (!refs.current.toolbar || !refs.current.body) return;
		const editor = new Quill(refs.current.body, {
			modules: { toolbar: { container: refs.current.toolbar } }});
		editor.root.innerHTML = props.content ?? '';
		editorRef.current = editor;

		editor.on('text-change', () => setProps({ content: editor.root.innerHTML }));
	}, []); // eslint-disable-line

	return (<Fragment>
		<div class='TextView EditTextView' ref={body => refs.current.body = body}/>

		<ComponentArea for={refs.current.body} visible={hovered || active} active={active} indicator={true}>
			<div class='EditTextView-ToolbarWrap'>
				<div ref={toolbar => refs.current.toolbar = toolbar}
					class={merge('EditTextView-Toolbar', active && 'Active')}>

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
		</ComponentArea>
	</Fragment>);
};

export const admin: AdminDefinition = {
	...server,
	editing: {
		propertyEditor: false,
		inlineEditor: EditTextView,
		focusRing: false
	}
};
