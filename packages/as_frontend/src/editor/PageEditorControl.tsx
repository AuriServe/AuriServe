// import * as Preact from 'preact';
// import { useMessaging, useImmediateRerender } from '../../Hooks';
// import { ObjectPath, Page } from 'auriserve-api';
// import { useState, useRef } from 'preact/hooks';

// import './PageEditorControl.sass';

// import ElementEditor from './ElementEditor';
// import DimensionTransition from '../DimensionTransition';

// import { PluginElements } from '../../LoadPlugins';

// interface Props {
// 	path: string;
// 	page: Page.Page;

// 	defs: PluginElements;

// 	onSave: (page: Page.Page) => void;
// }

// function recursivelyShrinkIncludes(node: Page.Child) {
// 	if (Page.isInclude(node)) delete node.elem;
// 	else (node.children || []).forEach(c => recursivelyShrinkIncludes(c));
// }

// export default function PageEditorControl(props: Props) {
// 	useImmediateRerender();

// 	const frameRef = useRef<HTMLIFrameElement>(null);
// 	const [ page, setPage ] = useState<Page.Page>(JSON.parse(JSON.stringify(props.page)));
// 	const [ editing, setEditing ] = useState<string | undefined>(undefined);

// 	const send = useMessaging(frameRef.current?.contentWindow, (type: string, body: any) => {
// 		switch (type) {
// 		case 'req-page':
// 			send!('page', page);
// 			break;

// 		case 'page':
// 			setPage(body);
// 			break;

// 		case 'edit':
// 			setEditing(body);
// 			break;

// 		default:
// 			console.error(`Unknown data recieved, type '${type}', body:`, body);
// 			break;
// 		}
// 	}, [ page ], 'editor');

// 	const handleSave = () => {
// 		let clonedPage = JSON.parse(JSON.stringify(page));
// 		if (clonedPage.elements.header) recursivelyShrinkIncludes(clonedPage.elements.header);
// 		if (clonedPage.elements.main) recursivelyShrinkIncludes(clonedPage.elements.main);
// 		if (clonedPage.elements.footer) recursivelyShrinkIncludes(clonedPage.elements.footer);
// 		props.onSave(page);
// 	};

// 	const handleElementSave = (props: any) => {
// 		const element = ObjectPath.traversePath(editing!, page.elements);
// 		const changed = JSON.stringify(element.props) !== JSON.stringify(props);
// 		setEditing(undefined);
		
// 		if (!changed) return;

// 		element.props = props;
// 		send!('page', page);
// 	};

// 	const handleReset = () => {
// 		setPage(props.page);
// 		send!('page', props.page);
// 	};

// 	const renderEditor = () => {
// 		try {
// 			let element = ObjectPath.traversePath(editing!, page.elements);
// 			if (Page.isInclude(element)) element = element.elem;

// 			return (
// 				<div class='PageEditorControl-EditorWrap'>
// 					<DimensionTransition duration={200}>
// 						<div class='PageEditorControl-Editor'>
// 							<h1>{element.elem}</h1>
// 							<ElementEditor
// 								defs={props.defs}
// 								element={element}
// 								onSave={handleElementSave}
// 								onCancel={() => setEditing(undefined)}
// 							/>
// 						</div>
// 					</DimensionTransition>
// 				</div>
// 			);
// 		}
// 		catch (e) {
// 			console.warn('Clicked invalid object');
// 			setEditing(undefined);
// 			return null;
// 		}
// 	};

// 	return (
// 		<div class='App'>
// 			<div class='PageEditorControl'>
// 				<div class='PageEditorControl-Header'>
// 					<h1>Editing {props.path}</h1>
// 					<div>
// 						<button class='PageEditorControl-HeaderResetButton' onClick={handleReset}>Reset</button>
// 						<button class='PageEditorControl-HeaderSaveButton' onClick={handleSave}>Save</button>
// 					</div>
// 				</div>
// 				<iframe class='PageEditorControl-Frame' ref={frameRef} src='/admin/renderer/' />

// 				{typeof(editing) === 'string' && renderEditor()}
// 			</div>
// 		</div>
// 	);
// }
