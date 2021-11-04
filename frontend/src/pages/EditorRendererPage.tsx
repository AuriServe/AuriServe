import { Page, ObjectPath } from 'common';
import { useAsyncMemo } from 'vibin-hooks';
import { h, createContext, VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Component from '../editor/Component';
import LayoutInjector from '../editor/LayoutInjector';

import { useMessaging } from '../Hooks';
import { useData, QUERY_THEMES } from '../Graph';

import loadPlugins from '../editor/LoadPlugins';

interface RendererContextData {
	active: string;
	setActive: (path: string) => void;
}

export const RendererContext = createContext<RendererContextData>({
	active: '',
	setActive: () => { /* No default action. */ }
});

function UndefinedElement({ elem }: { elem: string }) {
	return (
		<div class='m-2 flex place-items-center min-h-[8rem] bg-gray-900 border-2 border-gray-600 rounded-lg'>
			<p class='w-full text-center text-gray-100'><strong>{elem}</strong> is undefined.</p>
		</div>
	);
};

export default function EditorRendererPage() {
	const [ { themes } ] = useData(QUERY_THEMES, []);
	const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: true }), []);
	if (!elements) return <div/>;

	useEffect(() => {
		if (!themes) return;
		console.log(themes);
		themes.map(theme => document.head.innerHTML += theme.head);
	}, [ themes ]);

	useEffect(() => {
		document.documentElement.classList.remove('AS_APP');
		document.querySelector('[href="/admin/script/main.css"]')?.remove();
	}, []);

	const [ page, setPage ] = useState<Page.PageDocument | undefined>(undefined);
	const [ includes, setIncludes ] = useState<Record<string, Page.ComponentNode>>({});
	const [ activePath, setActivePath ] = useState<string | undefined>(undefined);

	const send = useMessaging(window.parent, (type: string, body: any) => {
		if (type === 'page:res') {
			setPage(body[0]);
			setIncludes(body[1]);
		}
		else console.warn(`Unknown data recieved, type '${type}', body:`, body);
	}, [], 'editor');

	useEffect(() => send!('page:req'), []);

	const handleSetActive = (path: string) => {
		setActivePath(path);
		// send!('component:edit', path);
	};

	const handleSetProps = (path: string, props: any) => {
		const newPage = JSON.parse(JSON.stringify(page));
		const element = ObjectPath.traversePath(path, newPage.elements);
		delete props.setProps;
		element.props = props;
		send!('page:set', newPage);
		setPage(newPage);
	};

	const renderTree = (root: Page.Node, path: string, overrides: Record<string, Record<string, any>>): VNode => {
		if (Page.isIncludeNode(root)) {
			overrides = root.override ?? {};
			root = includes[path];
		}

		const element = elements[root.elem];
		if (!element?.element) return <UndefinedElement elem={root.elem}/>;

		const InlineEditor = element.editing?.inlineEditor;
		const ElementComponent = InlineEditor ?? element.element;

		let elemProps = root.props;
		if (root.exposeAs && overrides[root.exposeAs]) elemProps = { ...elemProps, ...overrides[root.exposeAs ] };

		const children = root.children?.map((child, key) =>
			renderTree(child, ObjectPath.combinePath(path, 'children', key), overrides));

		return (
			<Component
				path={path}
				props={elemProps}
				spreadProps={!InlineEditor}
				component={ElementComponent}
				indicator={element.editing?.focusRing ?? true}
				setProps={handleSetProps.bind(undefined, path)}
				children={children}
			/>
		);
	};

	if (!page) return null;

	const start = performance.now();
	const nodes: {[key: string]: VNode} = {};
	Object.keys(page.elements).forEach(section =>
		nodes[section] = renderTree(page.elements[section], section, {}));
	const time = performance.now() - start;
	if (time > 1) console.log(`%cParsing Page Content took ${time.toLocaleString()} ms`,
		'color:#ebd834;text-align-center;background:#7d3000;padding:2px 6px;font-size: 12px;border-radius:100px;font-weight:bold');

	return (
		<RendererContext.Provider value={{
			active: activePath ?? '',
			setActive: handleSetActive
		}}>
			<div class='AS_ROOT'/>
			<LayoutInjector layout={page.layout ?? 'default'} elements={nodes!} />
		</RendererContext.Provider>
	);
}
