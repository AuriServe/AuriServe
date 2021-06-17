// import * as Preact from 'preact';
// import { useState, useEffect, useRef } from 'preact/hooks';
// import { useMessaging, useImmediateRerender } from '../Hooks';

// import { Page } from 'common';

// // import { useState, useRef } from 'preact/hooks';

// // import './PageEditorControl.sass';

// // import ElementEditor from './ElementEditor';
// // import DimensionTransition from '../DimensionTransition';

// import { mergeClasses } from '../Util';
// // import { PluginElements } from './LoadPlugins';

// interface Props {
// 	path: string;
// 	// page: Page.Page;

// 	// defs: PluginElements;

// 	onSave: (page: Page.PageDocument) => void;
// }

// // function recursivelyShrinkIncludes(node: Page.Child) {
// // 	if (Page.isInclude(node)) delete node.elem;
// // 	else (node.children || []).forEach(c => recursivelyShrinkIncludes(c));
// // }

// export default function EditorControl(props: Props) {
// 	useImmediateRerender();
// 	const frameRef = useRef<HTMLIFrameElement>(null);

// 	// Hide the always-displayed App scrollbar, this page doesn't scroll.
// 	useEffect(() => {
// 		document.documentElement.style.overflow = 'hidden';
// 		return () => document.documentElement.style.overflow = '';
// 	}, []);

// 	// Animate in the sidebar for a smoother transition from page to edit.
// 	const [ sidebarOpen, setSidebarOpen ] = useState<boolean>(false);
// 	useEffect(() => void(setTimeout(() => setSidebarOpen(true), 1000)), []);


// 	const [ page ] = useState<Page.PageDocument>(JSON.parse(JSON.stringify(props.page)));
// 	// 	const [ editing, setEditing ] = useState<string | undefined>(undefined);

// 	// Watch for events from the child frame.
// 	const send = useMessaging(frameRef.current?.contentWindow, (type: string, body: any) => {
// 		switch (type) {
// 		case 'req-page':
// 			send!('page', page);
// 			break;

// 		case 'page':
// 			// setPage(body);
// 			break;

// 		case 'edit':
// 			// setEditing(body);
// 			break;

// 		default:
// 			console.error(`Unknown data recieved, type '${type}', body:`, body);
// 			break;
// 		}
// 	}, [ page ], 'editor');

// 	// 	const handleSave = () => {
// 	// 		let clonedPage = JSON.parse(JSON.stringify(page));
// 	// 		if (clonedPage.elements.header) recursivelyShrinkIncludes(clonedPage.elements.header);
// 	// 		if (clonedPage.elements.main) recursivelyShrinkIncludes(clonedPage.elements.main);
// 	// 		if (clonedPage.elements.footer) recursivelyShrinkIncludes(clonedPage.elements.footer);
// 	// 		props.onSave(page);
// 	// 	};

// 	// 	const handleElementSave = (props: any) => {
// 	// 		const element = ObjectPath.traversePath(editing!, page.elements);
// 	// 		const changed = JSON.stringify(element.props) !== JSON.stringify(props);
// 	// 		setEditing(undefined);
			
// 	// 		if (!changed) return;

// 	// 		element.props = props;
// 	// 		send!('page', page);
// 	// 	};

// 	// 	const handleReset = () => {
// 	// 		setPage(props.page);
// 	// 		send!('page', props.page);
// 	// 	};

// 	// 	const renderEditor = () => {
// 	// 		try {
// 	// 			let element = ObjectPath.traversePath(editing!, page.elements);
// 	// 			if (Page.isInclude(element)) element = element.elem;

// 	// 			return (
// 	// 				<div class='PageEditorControl-EditorWrap'>
// 	// 					<DimensionTransition duration={200}>
// 	// 						<div class='PageEditorControl-Editor'>
// 	// 							<h1>{element.elem}</h1>
// 	// 							<ElementEditor
// 	// 								defs={props.defs}
// 	// 								element={element}
// 	// 								onSave={handleElementSave}
// 	// 								onCancel={() => setEditing(undefined)}
// 	// 							/>
// 	// 						</div>
// 	// 					</DimensionTransition>
// 	// 				</div>
// 	// 			);
// 	// 		}
// 	// 		catch (e) {
// 	// 			console.warn('Clicked invalid object');
// 	// 			setEditing(undefined);
// 	// 			return null;
// 	// 		}
// 	// 	};

// 	return (
// 		<div class='AS_ROOT grid min-h-screen overflow-hidden bg-gray-700'>
// 			<div class={mergeClasses('bg-gray-700 w-80 h-full absolute transition-all duration-500 transform z-10',
// 				sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>

// 				<p class='text-gray-900 p-8'>Hello world</p>
// 			</div>
// 			<iframe ref={frameRef} src='/admin/renderer/'
// 				class={mergeClasses('place-self-stretch border-0 shadow-lg overflow-hidden transition-all duration-500',
// 					!sidebarOpen ? 'pl-0 rounded-none m-0' : 'ml-[20.75rem] rounded-lg m-3')} />
// 			{/* <h1 class='fixed top-8 left-8'>Testing</h1>*/}
// 			{/* {typeof(editing) === 'string' && renderEditor()}*/}
// 		</div>
// 	);
// }
