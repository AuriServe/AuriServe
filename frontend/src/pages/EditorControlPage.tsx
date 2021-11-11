import { h, Fragment } from 'preact';
import { useAsyncMemo } from 'vibin-hooks';
import { useState, useEffect } from 'preact/hooks';
import { useLocation, useHistory } from 'react-router-dom';

import * as Int from 'common/graph/type';
import { Page, ObjectPath } from 'common';

import { Button } from '../structure';

// import EditorControl from '../editor/EditorControl';

// import ElementEditor from '../editor/ElementEditor';
import { useMessaging } from '../Hooks';
import { query, useData, QUERY_PAGE, QUERY_INCLUDE, QUERY_MEDIA, MUTATE_PAGE } from '../Graph';

// import { mergeClasses } from 'common/util';
import loadPlugins from '../editor/LoadPlugins';

async function parseProp(prop: any, media: Int.Media[]) {
	let wasValue = false;

	if (typeof prop === 'object') {
		if ('_id' in prop) {
			const mediaItem = (media || []).filter(m => m.id === prop._id)[0];
			if (mediaItem) prop = mediaItem;
			delete prop.path;
			delete prop._id;
			wasValue = true;
		}
	}
	else wasValue = true;

	return [ prop, wasValue ];
}

async function parseProps(prop: any, media: Int.Media[]) {
	const [ newProp, wasValue ] = await parseProp(prop, media);
	prop = newProp;

	if (!wasValue && typeof prop === 'object') {
		if (Array.isArray(prop)) for (let i = 0; i < prop.length; i++)
			prop[i] = await parseProps(prop[i], media);

		else if (typeof prop === 'object') for (let iden of Object.keys(prop)) {
			prop[iden] = await parseProps(prop[iden], media);
		}
	}

	return prop;
}

async function fetchPage(path: string, media: Int.Media[]):
Promise<[ Page.PageDocument, Record<string, Page.ComponentNode> ]> {

	const { page: raw } = await query<{ page: Int.Page }>(QUERY_PAGE, { path });
	const rawIncludes: Record<string, string> = {};

	const elements: Record<string, Page.Node> = JSON.parse(raw.content ?? '');
	const includes: Record<string, Page.ComponentNode> = {};

	async function expandTree(root: Page.Node, path: string) {
		let node: Page.ComponentNode;
		if (Page.isIncludeNode(root)) {
			if (!rawIncludes[root.include]) rawIncludes[root.include] =
				(await query<{ include: Int.Include }>(QUERY_INCLUDE, { path: root.include })).include.content!;
			includes[path] = JSON.parse(rawIncludes[root.include]);
			node = includes[path];
		}
		else node = root;

		if (node.props) node.props = await parseProps(node.props, media);
		await Promise.all(node.children?.map((child, key) => expandTree(child, ObjectPath.combinePath(path, 'children', key))) ?? []);
	};

	await Promise.all(Object.keys(elements).map(key => expandTree(elements[key], key)));

	const page: Page.PageDocument = {
		name: raw.name,
		description: raw.description,

		elements,
		layout: raw.layout
	};

	return [ page, includes ];
}

export default function EditorControlPage() {
	// const forceUpdate = useForceUpdate();
	const history = useHistory(), location = useLocation();
	const pagePath = location.pathname.replace(/^\/pages\//g, '');
	if (!pagePath) history.push('/pages');

	const [ { media } ] = useData(QUERY_MEDIA, []);

	// Hide the always-displayed App scrollbar, this page doesn't scroll.
	useEffect(() => {
		document.documentElement.style.overflow = 'hidden';
		return () => document.documentElement.style.overflow = '';
	}, []);

	const [ frame, setFrame ] = useState<HTMLIFrameElement | null>(null);

	// const [ editing, setEditing ] = useState<string | undefined>(undefined);
	const [ page, setPage ] = useState<Page.PageDocument | undefined>(undefined);
	const [ includes, setIncludes ] = useState<Record<string, Page.ComponentNode>>({});

	const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: false }), []);
	useEffect(() => {
		if (!media) return;
		fetchPage(pagePath, media).then(([ page, includes ]) => {
			setPage(page);
			setIncludes(includes);
		});
	}, [ pagePath, media ]);

	const send = useMessaging(frame?.contentWindow, (type: string, body: any) => {
		if (type === 'page:req') send!('page:res', [ page, includes ]);
		else if (type === 'page:set') setPage(body);
		// else if (type === 'component:edit') setEditing(body);
		else console.warn(`Unknown data recieved, type '${type}', body:`, body);
	}, [ page, includes, frame ], 'editor');

	const handleSave = () => {
		console.log('Attempting to save.');
		query(MUTATE_PAGE, { path: pagePath, content: JSON.stringify(page?.elements) });
	};

	// // Animate in the sidebar for a smoother transition from page to edit.
	// const [ sidebarOpen, setSidebarOpen ] = useState<boolean>(false);
	// useEffect(() => void(setTimeout(() => setSidebarOpen(true), 1000)), []);

	// const handleElementSave = (props: any) => {
	// 	const element = ObjectPath.traversePath(editing!, page!.elements);
	// 	const changed = JSON.stringify(element.props) !== JSON.stringify(props);
	// 	if (!changed) return;

	// 	element.props = props;
	// 	forceUpdate();
	// 	send!('page:res', [ page, includes ]);
	// };

	if (!page || !elements) return <p>Loading...</p>;

	// const editingElem = editing && ObjectPath.traversePath(editing, page.elements);

	return (
		<Fragment>
			{/* <div class={mergeClasses('bg-neutral-800 w-96 p-3 h-full absolute transition-all duration-300 transform z-10 shadow-md',
				sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
				{editing && <ElementEditor definition={elements[editingElem.elem]!}
					props={editingElem.props} onChange={props => handleElementSave(props)}/>}
				</div>*/}
			<iframe ref={setFrame} src='/admin/renderer/'
				class='place-self-stretch bg-white border-0 overflow-hidden transition-all duration-300 shadow-lg h-full pl-0' />
			<div class='fixed bottom-8 right-8 z-10'><Button label='Save' onClick={handleSave}/></div>
		</Fragment>
	);
}
