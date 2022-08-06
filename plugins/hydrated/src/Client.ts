/* eslint-disable @typescript-eslint/ban-ts-comment */

import { hydrate as preactHydrate, h, FunctionalComponent } from 'preact';

import Static from './Static';

import * as Preact from 'preact';
import * as PreactHooks from 'preact/hooks';
import * as PreactCompat from 'preact/compat';

// @ts-ignore
window.__AS_PREACT = Preact;
// @ts-ignore
window.__AS_PREACT_HOOKS = PreactHooks;
// @ts-ignore
window.__AS_PREACT_COMPAT = PreactCompat;

// @ts-ignore
window.__AURISERVE = {};
// @ts-ignore
window.__AURISERVE.hydrated = {};
//@ts-ignore
window.__AURISERVE.hydrated.Static = Static;

// @ts-ignore
window.__AURISERVE.hydrated.hydrate = function(identifier: string, element: FunctionalComponent) {
	window.setTimeout(() => {
		document.querySelectorAll(`[data-element="${identifier}"]`).forEach(elem => {
			const script = elem.querySelector(':scope > script') as HTMLScriptElement;
			const props = JSON.parse(script.innerText);
			script.remove();
			preactHydrate(h(element, props), elem);
		}, 50);
	});
}
