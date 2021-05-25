import * as Preact from 'preact';
import { createPortal } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import './PageLayout.sass';

interface Props {
	layout: string;
	elements: {[key: string]: Preact.VNode};
}

/**
 * Renders an HTML String layout template,
 * and inserts element roots into it. Attempts to mimic the server-side layout
 * process as much as possible, and minimize layout recalculations.
 *
 * A warning message is sent to the console when a render occurs,
 * if this message is sent more than once, something has gone wrong.
 */

export default function PageLayout(props: Props) {
	const [ layout, setLayout ] = useState<string>('');
	const [ layoutRoots, setLayoutRoots ] = useState<{[key: string]: HTMLElement} | undefined>(undefined);


	/**
	 * Re-acquire layout string when the layout property changes.
	 */

	useEffect(() => {
		if (!props.layout) return;

		let set = true;
		(async () => {
			const r = await fetch('/admin/themes/layout/', {
				method: 'POST', cache: 'no-cache',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ layout: props.layout })
			});

			const layout = await r.text();
			
			if (r.status !== 200) return console.error(layout);
			else if (!set) return;

			setLayout(layout);
			setLayoutRoots(undefined);
		})();
		
		return () => set = false;
	}, [ props.layout ]);


	/**
	 * Insert the layout DOM elements into the body, add necessary layout classes to body,
	 * and stores references to the root containers to portal into.
	 *
	 * DOM NODES ARE INSERTED IMPERATIVELY:
	 * This is against the React style, but it does its best to clean up after itself upon
	 * a re-render. Assumes that body classes will not change outside of this effect.
	 */

	useEffect(() => {
		if (!layout) return;

		let root: HTMLElement = document.createElement('div');
		root.innerHTML = layout.trim().replace(/\<body/g, '<div').replace(/\<\/body/g, '</div');
		root = root.childNodes[0] as HTMLElement;

		const preClasses = document.body.className.split(' ');
		const classes = root.className.split(' ').filter(c => !preClasses.includes(c));

		let newLayoutRoots: {[key: string]: HTMLElement} = {};
		root.querySelectorAll('[data-include]').forEach(e => {
			const section = e.getAttribute('data-include') ?? '';
			e.removeAttribute('data-include');
			if (!props.elements[section]) e.remove();
			else if (!newLayoutRoots[section]) newLayoutRoots[section] = e as HTMLElement;
		});

		const nodes = Array.from(root.childNodes);
		nodes.forEach(child => document.body.appendChild(child));
		classes.forEach(c => document.body.classList.add(c));

		console.warn('Rendering Layout');

		setLayoutRoots(newLayoutRoots);

		return () => {
			nodes.forEach(e => e.remove());
			classes.forEach(c => document.body.classList.remove(c));
		};
	}, [ layout ]);

	return (
		<Preact.Fragment>
			{!layoutRoots && <h1 class='PageLayout-Loading' style={{ position: 'absolute', top: '50vh', left: '50vw',
				transform: 'translate(-50%, -100%)', fontFamily: 'sans-serif', opacity: 0.2}}>Loading Layout...</h1>}
				
			{layoutRoots && Object.keys(layoutRoots).map(section => {
				if (!props.elements[section]) return undefined;
				return createPortal(props.elements[section], layoutRoots[section]);
			})}
		</Preact.Fragment>
	);
}
