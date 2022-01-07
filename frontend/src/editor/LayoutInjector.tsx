import { h, VNode, Fragment } from 'preact';
import { createPortal } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { useQuery, QUERY_LAYOUT } from '../Graph';

interface Props {
	layout: string;
	elements: { [key: string]: VNode };
}

/**
 * Renders an HTML String layout template,
 * and inserts element roots into it. Attempts to mimic the server-side layout
 * process as much as possible, and minimize layout recalculations.
 *
 * A warning message is sent to the console when a render occurs,
 * if this message is sent more than once, something has gone wrong.
 */

export default function LayoutInjector(props: Props) {
	const [{ layout }] = useQuery(QUERY_LAYOUT, { loadOnReload: false }, { name: props.layout }) as any;
	const [layoutRoots, setLayoutRoots] = useState<{ [key: string]: HTMLElement } | undefined>(undefined);

	/**
	 * Insert the layout DOM elements into the body, add necessary layout classes to body,
	 * and stores references to the root containers to portal into.
	 *
	 * DOM NODES ARE INSERTED IMPERATIVELY:
	 * This is against the React style, but it does its best to clean up after itself upon
	 * a re-render. Assumes that body classes will not change outside of this effect.
	 */

	useEffect(() => {
		if (!layout || !layout.html) return;

		let root: HTMLElement = document.createElement('div');
		root.innerHTML = layout.html;
		// root.innerHTML = layout.html.trim().replace(/\<body/g, '<div').replace(/\<\/body/g, '</div');
		root = root.childNodes[0] as HTMLElement;

		const newLayoutRoots: { [key: string]: HTMLElement } = {};
		root.querySelectorAll('[data-include]').forEach((e) => {
			const section = e.getAttribute('data-include') ?? '';
			e.removeAttribute('data-include');
			if (!props.elements[section]) e.remove();
			else if (!newLayoutRoots[section]) newLayoutRoots[section] = e as HTMLElement;
		});

		document.body.append(root);

		console.log(
			'%cRendering Layout',
			'color:#ebd834;text-align-center;background:#7d3000;padding:2px 6px;font-size: 12px;border-radius:100px;font-weight:bold'
		);

		setLayoutRoots(newLayoutRoots);

		return () => root.remove();
	}, [layout, props.elements]);

	return (
		<Fragment>
			{layoutRoots &&
				Object.keys(layoutRoots).map((section) => {
					if (!props.elements[section]) return undefined;
					return createPortal(props.elements[section], layoutRoots[section]);
				})}
		</Fragment>
	);
}
