import { RefCallback } from 'preact';
import { useRef } from 'preact/hooks';

function getFocusableElements(root: HTMLElement): HTMLElement[] {
	return Array.from(root.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])') as NodeListOf<HTMLElement>);
}

interface Options {
	/** Whether or not to display the focus change on the first shift. Default true. */
	focusVisible?: boolean;
}

export default function useTrapFocus<T extends HTMLElement>(options: Options = {}): RefCallback<T> {
	const lastElement = useRef<HTMLElement | null>(null);
	const initialFocus = useRef<HTMLElement | null>(null);
	const callbacks = useRef<({ keyboard: (evt: KeyboardEvent) => void, mouse: () => void }) | null>(null);

	return (element) => {
		if (element && element !== lastElement.current) {
			if (!initialFocus.current) initialFocus.current = document.activeElement as HTMLElement;
			lastElement.current = element;

			if (options.focusVisible ?? true) setTimeout(() => {
				const elem = getFocusableElements(element)[0]!;
				elem.focus();
				elem.classList.add('focus-visible');
			});

			const handleMouseDown = () => {
				const fakeFocused = document.querySelector('.focus-visible');
				if (fakeFocused) fakeFocused.classList.remove('focus-visible');
			}

			const handleKeyDown = (evt: KeyboardEvent) => {
				if (evt.key === 'Tab') {
					evt.preventDefault();

					const fakeFocused = document.querySelector('.focus-visible');
					if (fakeFocused) fakeFocused.classList.remove('focus-visible');

					const elements = getFocusableElements(element);
					let currentInd = elements.indexOf(document.activeElement as HTMLElement);

					if (currentInd === -1) {
						elements[0]?.focus();
						currentInd = 0;
					}

					const newInd = (currentInd + (evt.shiftKey ? -1 : 1) + elements.length) % elements.length;
					elements[newInd]?.focus();
				}
			}

			if (callbacks.current) {
				window.removeEventListener('keydown', callbacks.current.keyboard);
				window.removeEventListener('mousedown', callbacks.current.mouse);
				callbacks.current = null;
			}

			callbacks.current = { keyboard: handleKeyDown, mouse: handleMouseDown };
			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('mousedown', handleMouseDown);
		}
		else if (!element && lastElement.current) {
			initialFocus.current?.focus();
			initialFocus.current = null;
			lastElement.current = null;
		}

		if (!element && callbacks.current) {
			window.removeEventListener('keydown', callbacks.current.keyboard);
			window.removeEventListener('mousedown', callbacks.current.mouse);
			callbacks.current = null;
		}
	};
}
