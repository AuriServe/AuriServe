import * as Preact from 'preact';
import { useMessaging } from '../Hooks';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';

import { Portal } from '../structure';
import LayoutInjector from './LayoutInjector';

import { Page, ObjectPath } from 'common';
import { PluginElements } from './LoadPlugins';

import { mergeClasses } from '../Util';

import style from './EditorRenderer.sss';

const FOCUS_RING_POPOUT = 6;
const FOCUS_RING_BOUNDARY = 4;

interface FocusRingProps {
	active: boolean;
	capture: HTMLButtonElement;
}

function getElementBounds(elem: HTMLElement) {
	const clientBounds = elem.getBoundingClientRect();
	const style = getComputedStyle(elem);

	const marginTop    = Number.parseInt(style.marginTop   .replace('px', ''), 10);
	const marginBottom = Number.parseInt(style.marginBottom.replace('px', ''), 10);
	const marginLeft   = Number.parseInt(style.marginLeft  .replace('px', ''), 10);
	const marginRight  = Number.parseInt(style.marginRight .replace('px', ''), 10);

	return { top: clientBounds.top - marginTop, left: clientBounds.left - marginLeft,
		width: clientBounds.width + marginLeft + marginRight,
		height: clientBounds.height + marginTop + marginBottom
	};
}

function FocusRing(props: FocusRingProps) {
	let bounds = { top: Infinity, left: Infinity, width: 0, height: 0 };

	Array.from(props.capture?.children ?? []).forEach(child => {
		const rect = getElementBounds(child as HTMLElement);
		if (rect.width) bounds.left = Math.max(Math.min(bounds.left, rect.left + window.scrollX - FOCUS_RING_POPOUT), FOCUS_RING_BOUNDARY);
		if (rect.width) bounds.top = Math.max(Math.min(bounds.top, rect.top + window.scrollY - FOCUS_RING_POPOUT), FOCUS_RING_BOUNDARY);
		bounds.width = Math.max(bounds.width, rect.width + FOCUS_RING_POPOUT * 2);
		bounds.height = Math.max(bounds.height, rect.height + FOCUS_RING_POPOUT * 2);
	});

	bounds.width = Math.min(bounds.width, document.documentElement.scrollWidth - bounds.left - FOCUS_RING_BOUNDARY);
	bounds.height = Math.min(bounds.height, document.documentElement.scrollHeight - bounds.top - FOCUS_RING_BOUNDARY);

	const shadowAlpha = props.active ? 0.2 : 0.05;

	return (
		<Portal to={document.getElementById('root')!}>
			<div style={{ boxShadow: `inset 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha}), 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha})`, ...bounds }}
				class={mergeClasses('box-border absolute rounded-md select-none pointer-events-none border-2 z-50',
					props.active ? 'animate-select border-blue-500' : 'animate-fadein-150 border-blue-400')}/>
		</Portal>
	);
}

interface ComponentCaptureProps {
	active: boolean;
	onClick?: () => void;
	children: Preact.ComponentChildren;
}

function ComponentCapture(props: ComponentCaptureProps) {
	const timeout = useRef<number>(0);
	const ref = useRef<HTMLButtonElement>(null);
	const [ hover, setHover ] = useState<boolean>(false);
	

	const handleClick = (evt: any) => {
		evt.preventDefault();
		evt.stopPropagation();
		// console.log('click', ref.current?.children);
		props.onClick?.();
	};

	const handleMouseOver = (evt: any) => {
		evt.preventDefault();
		evt.stopPropagation();

		// console.log('mouse over', props.path);
		window.clearTimeout(timeout.current);
		setHover(true);
	};

	const handleMouseOut = (evt: any) => {
		evt.preventDefault();
		evt.stopPropagation();

		// console.log('mouse out', props.path);
		timeout.current = window.setTimeout(() => setHover(false), 16);
	};

	return (
		<button ref={ref} style={{ textAlign: 'unset', display: 'contents', cursor: 'pointer' }}
			onClick={handleClick}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}>
			{props.children}
			{(hover || props.active) && <FocusRing capture={ref.current!} active={props.active}/>}
		</button>
	);
}

interface Props {
	defs: PluginElements;
}

export default function EditorRenderer(props: Props) {
	const [ page, setPage ] = useState<Page.PageDocument | undefined>(undefined);
	const [ includes, setIncludes ] = useState<Record<string, Page.ComponentNode>>({});
	const [ activePath, setActivePath ] = useState<string | undefined>(undefined);

	// const [ hovered, setHovered ] = useState<{ path: string; elem: HTMLElement } | undefined>(undefined);

	useEffect(() => document.documentElement.classList.remove('AS_APP'));

	const send = useMessaging(window.parent, (type: string, body: any) => {
		if (type === 'page:res') {
			setPage(body[0]);
			setIncludes(body[1]);
		}
		else console.warn(`Unknown data recieved, type '${type}', body:`, body);
	}, [], 'editor');

	useEffect(() => send!('page:req'), []);

	// const handleHover = (path: string, evt: MouseEvent) => {
	// 	if (hovered?.path !== path) setHovered({ path: path, elem: evt.currentTarget as HTMLElement });
	// };

	// const handleClick = (path: string, broadcast: boolean, evt: MouseEvent | TouchEvent) => {
	// 	evt.stopPropagation();
	// 	evt.preventDefault();

	// 	if (broadcast) send!('component:edit', path);
	// };

	const handleComponentClick = (path: string) => {
		setActivePath(path);
		send!('component:edit', path);
	};

	const handleSetProps = (path: string, props: any) => {
		const newPage = JSON.parse(JSON.stringify(page));
		const element = ObjectPath.traversePath(path, newPage.elements);
		delete props.setProps;
		element.props = props;
		send!('page:set', newPage);
		setPage(newPage);
	};

	const renderUndefined = (elem: string): Preact.VNode => {
		return (
			<div class={style.UndefinedElement}>
				<p><strong>{elem}</strong> is undefined.</p>
			</div>
		);
	};

	// const renderFocusRing = () => {
	// 	const buffer = 8;
	// 	let bounds = { top: Infinity, left: Infinity, width: 0, height: 0 };

	// 	Array.from(hovered!.elem.children).forEach((child: Element) => {
	// 		let rect = child.getBoundingClientRect();
	// 		if (rect.width) bounds.left = Math.max(Math.min(bounds.left, rect.x + window.scrollX - buffer), buffer);
	// 		if (rect.width) bounds.top = Math.max(Math.min(bounds.top, rect.y + window.scrollY - buffer), buffer);
	// 		bounds.width = Math.max(bounds.width, rect.width + buffer * 2);
	// 		bounds.height = Math.max(bounds.height, rect.height + buffer * 2);
	// 	});

	// 	bounds.width = Math.min(bounds.width, document.documentElement.scrollWidth - bounds.left - buffer);
	// 	bounds.height = Math.min(bounds.height, document.documentElement.scrollHeight - bounds.top - buffer);

	// 	return (
	// 		<div class={style.FocusRing} style={bounds} />
	// 	);
	// };

	const renderTree = (root: Page.Node, path: string, overrides: Record<string, Record<string, any>>): Preact.VNode => {
		if (Page.isIncludeNode(root)) {
			overrides = root.override ?? {};
			root = includes[path];
		}

		const element = props.defs[root.elem];
		if (!element?.element) return renderUndefined(root.elem);

		const InlineEditor = element.editing?.inlineEditor;
		const PropertyEditor = element.editing?.propertyEditor;

		let elemProps = root.props;
		if (root.exposeAs && overrides[root.exposeAs]) elemProps = { ...elemProps, ...overrides[root.exposeAs ] };

		const children = root.children?.map((child, key) => renderTree(child, ObjectPath.combinePath(path, 'children', key), overrides));

		if (InlineEditor) return (
			<ComponentCapture active={path === activePath} onClick={() => handleComponentClick(path)}>
				<InlineEditor props={elemProps} setProps={(props: any) => handleSetProps(path, props)}>
					{children}
				</InlineEditor>
			</ComponentCapture>
		);

		const Element = element.element;
		return (
			<ComponentCapture active={path === activePath} onClick={() => handleComponentClick(path)}>
				<Element {...elemProps}>{children}</Element>
			</ComponentCapture>
		);
	};

	if (!page) return null;

	const start = performance.now();
	const nodes: {[key: string]: Preact.VNode} = {};
	Object.keys(page.elements).forEach(section =>
		nodes[section] = renderTree(page.elements[section], section, {}));
	const time = performance.now() - start;
	console.log(`%cParsing Page Content took ${time.toLocaleString()} ms`,
		'color:#ebd834;text-align-center;background:#7d3000;padding:2px 6px;font-size: 12px;border-radius:100px;font-weight:bold');

	return (
		<Preact.Fragment>
			<LayoutInjector layout={page.layout ?? 'default'} elements={nodes!} />
			{/* {hovered && renderFocusRing()}*/}
		</Preact.Fragment>
	);
}
