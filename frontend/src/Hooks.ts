import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';


/**
 * Returns a function that forces a component to rerender.
 * Can be used to manually reload a component if it becomes desync'd from the state.
 * Warning: If you're considering using this function, there's probably larger issues here, AURI.
 *
 * @returns a function that can be called to rerender the component.
 */

export function useForceUpdate(): () => void {
	const [ , setValue ] = useState<boolean>(false);
	return () => setValue(value => !value);
};


/**
 * Forces an immediate rerender of a component as soon as it mounts.
 * Can be used to ensure that a component is rerendered after a ref is attached.
 */

export function useImmediateRerender() {
	const forceUpdate = useForceUpdate();
	useEffect(() => forceUpdate(), []);
};


/**
 * Calls onCancel if a click event is triggered on an element that is not a child of the currently ref'd popup.
 * Optionally, a condition function can be supplied, and the cancel test will only occur if the function returns true.
 * Any dependents for the condition function can be supplied in the dependents array,
 * this hook will automatically handle depending on the current popup, cancel function, and condition function.
 *
 * @param {Preact.RefObject<any>} roots - A ref of elements to exclude from outside-clicks.
 * @param {Function} onCancel - The function to call if a click occurs outside of `popup`.
 * @param {Function} condition - An optional function to determine whether or not to run the click test.
 * @param {any[]} dependents - An array of dependents for the condition function.
 */

export function usePopupCancel(roots: Preact.RefObject<any> | Preact.RefObject<any>[],
	onCancel: () => any, condition?: () => boolean, dependents?: any[]) {
	
	const body = document.getElementsByTagName('body')[0];

	useEffect(() => {
		const rootsArray = Array.isArray(roots) ? roots : [ roots ];
		if (condition && !condition()) return;

		const handlePointerCancel = (e: MouseEvent | TouchEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		const handleFocusCancel = (e: FocusEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		body.addEventListener('focusin', handleFocusCancel);
		body.addEventListener('mousedown', handlePointerCancel);
		body.addEventListener('touchstart', handlePointerCancel);

		return () => {
			body.removeEventListener('focusin', handleFocusCancel);
			body.removeEventListener('mousedown', handlePointerCancel);
			body.removeEventListener('touchstart', handlePointerCancel);
		};
	}, [ onCancel, condition, ...dependents || [] ]);
}


/**
 * Sends a message to a host with the requested properties.
 */

function sendMessage(key: string, target: { postMessage: any }, type: string, body?: any) {
	target.postMessage({ _as: key, type: type, body: body });
}


/**
 * Takes a message event, a key, and a recieve callback and
 * executes the callback if it meets the required parameters.
 */

function recieveMessage(key: string, onRecieve: (type: string, body?: string) => void, evt: MessageEvent) {
	if (evt.origin !== window.location.origin || !evt.data._as || evt.data._as !== key) return;

	const type = evt.data.type as string;
	const body = evt.data.body as any;

	onRecieve(type, body);
}


/**
 * Provides cross-origin message passing between hosts, with an optional key to mask out other origins.
 * This function works by being defined on both ends, and both are initialized with the same key.
 *
 * @param {{ postMessage: any }} target - The target to send messages to, must have a postMessage method.
 * @param {Function} onRecieve - The function to call when a messae is recieved.
 * @param {string} key - An optional string to mask out other origins.
 * @returns a function to send messages between origins.
 */

export function useMessaging(target: { postMessage: any } | null | undefined,
	onRecieve: (type: string, body?: string) => void, dependents: any[], key: string = '!') {

	useEffect(() => {
		if (!target) return;
		const cb = recieveMessage.bind(undefined, key, onRecieve);

		window.addEventListener('message', cb);
		return () => window.removeEventListener('message', cb);
	}, [ key, target, onRecieve, ...dependents ]);

	return target && sendMessage.bind(undefined, key, target);
}
