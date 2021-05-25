// import * as Preact from 'preact';
// import { useMessaging } from '../Hooks';
// // import { ObjectPath, Page } from 'auriserve-api';
// import { useState, useEffect } from 'preact/hooks';

// type Page = any;
// const ObjectPath = {
// 	combinePath: (..._w: any) => null as any,
// 	traversePath: (..._w: any) => null as any
// };

// import './PageEditorRenderer.sass';

// import PageLayout from './PageLayout';

// import { PluginElements } from '../plugin/LoadPlugins';

// interface Props {
// 	defs: PluginElements;
// }

// export default function PageEditorRenderer(props: Props) {
// 	const [ page, setPage ] = useState<Page | undefined>(undefined);
// 	const [ hovered, setHovered ] = useState<{ path: string; elem: HTMLElement } | undefined>(undefined);

// 	const send = useMessaging(window.parent, (type: string, body: any) => {
// 		switch (type) {
// 		case 'page':
// 			setPage(body);
// 			break;

// 		default:
// 			console.error(`Unknown data recieved, type '${type}', body:`, body);
// 			break;
// 		}
// 	}, [], 'editor');

// 	useEffect(() => send!('req-page'), []);

// 	const handleHover = (path: string, evt: MouseEvent) => {
// 		evt.stopPropagation();
// 		evt.preventDefault();

// 		if (hovered?.path !== path) setHovered({ path: path, elem: evt.currentTarget as HTMLElement });
// 	};

// 	const handleClick = (path: string, broadcast: boolean, evt: MouseEvent | TouchEvent) => {
// 		evt.stopPropagation();
// 		evt.preventDefault();

// 		if (broadcast) send!('edit', path);
// 	};

// 	const handleSetProps = (path: string, props: any) => {
// 		const newPage = JSON.parse(JSON.stringify(page));
// 		const element = ObjectPath.traversePath(path, newPage.elements);
// 		delete props.setProps;
// 		element.props = props;
// 		send!('page', newPage);
// 		setPage(newPage);
// 	};

// 	const renderUndefined = (elem: string): Preact.VNode => {
// 		return (
// 			<div class='PageEditorRenderer-UndefinedElement'>
// 				<p><strong>{elem}</strong> is undefined.</p>
// 			</div>
// 		);
// 	};

// 	const renderClickCapture = (path: string, child: Preact.ComponentChild, broadcast: boolean = true) => {
// 		return (
// 			<button class='PageEditorRenderer-ClickCapture'
// 				onMouseOver={(e) => handleHover(path, e)}
// 				onClick={(e) => handleClick(path, broadcast, e)}>
// 				{child}
// 			</button>
// 		);
// 	};

// 	const renderFocusRing = () => {
// 		const buffer = 0;
// 		let bounds = { top: Infinity, left: Infinity, width: 0, height: 0 };

// 		Array.from(hovered!.elem.children).forEach((child: Element) => {
// 			let rect = child.getBoundingClientRect();
// 			if (rect.width) bounds.left = Math.min(bounds.left, rect.x + window.scrollX - buffer);
// 			if (rect.width) bounds.top = Math.min(bounds.top, rect.y + window.scrollY - buffer);
// 			bounds.width = Math.max(bounds.width, rect.width + buffer * 2);
// 			bounds.height = Math.max(bounds.height, rect.height + buffer * 2);
// 		});

// 		return (
// 			<div class='PageEditorRenderer-FocusRing' style={bounds} />
// 		);
// 	};

// 	const renderTree = (root: Page.Child, path: string): Preact.VNode => {
// 		if (Page.isInclude(root)) root = root.elem as Page.Element;
// 		const element = props.defs[root.elem];
// 		if (!element?.element) return renderUndefined(root.elem);

// 		const InlineEditor = element.editing?.inlineEditor;
// 		const PropertyEditor = element.editing?.propertyEditor;

// 		if (InlineEditor) {
// 			return renderClickCapture(path, <InlineEditor {...root.props} setProps={(props: any) => handleSetProps(path, props)}>
// 				{root.children?.map((child, key) => renderTree(child, ObjectPath.combinePath(path, 'children', key)))}
// 			</InlineEditor>, PropertyEditor !== false);
// 		}

// 		const Element = element.element;
// 		return renderClickCapture(path, <Element {...root.props}>
// 			{root.children?.map((child, key) => renderTree(child, ObjectPath.combinePath(path, 'children', key)))}
// 		</Element>);
// 	};

// 	// No loading screen required -- This should only be present for a moment.
// 	if (!page) return null;

// 	let elements: {[key: string]: Preact.VNode} = {};
// 	Object.keys(page.elements).forEach(section => {
// 		elements[section] = renderTree(page.elements[section], section);
// 	});

// 	return (
// 		<Preact.Fragment>
// 			<PageLayout layout={page.layout ?? 'default'} elements={elements} />
// 			{hovered && renderFocusRing()}
// 		</Preact.Fragment>
// 	);
// }
