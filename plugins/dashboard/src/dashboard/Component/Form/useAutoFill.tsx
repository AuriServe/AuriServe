import { RefObject } from 'preact';
import { useRef, useEffect, useState, useMemo } from 'preact/hooks';

import { tw, css } from '../../Twind';

type UseAutoFillResult<Element> = [RefObject<Element>, string];

/**
 * Chrome sucks ass and tries to override form styles really shittily when an input is autofilled.
 * This hook does its best to prevent that using agressively stupid CSS. Despite my best efforts,
 * I cannot make the small text that displays before any user interaction bigger,
 * as it's not rendered on the page and seems to only inherit the text color, not any other CSS properties,
 * but it's still way fucking better than nothing. Also works on Firefox fine.
 *
 * @param invalid - A boolean to indicate that the input is invalid.
 * @returns a ref object and class name to apply to the input.
 */

export default function useAutoFill<Element extends HTMLElement = HTMLElement>(
	invalid: boolean
): UseAutoFillResult<Element> {
	const ref = useRef<Element>(null);

	const [autofill, setAutofill] = useState<boolean>(false);
	const [settled, setSettled] = useState<boolean>(true);

	useEffect(() => {
		const input = ref.current;
		if (!input) return;

		const onAnimationStart = (event: AnimationEvent) => {
			setAutofill((autofill) => {
				let newAutofill = autofill;
				if (event.animationName === 'onAutoFillStart') newAutofill = true;
				else if (event.animationName === 'onAutoFillCancel') newAutofill = false;

				if (autofill === newAutofill) return newAutofill;

				setSettled(false);
				setTimeout(() => setSettled(true), 250);

				return newAutofill;
			});
		};

		input.addEventListener('animationstart', onAnimationStart);
		return () => input.removeEventListener('animationstart', onAnimationStart);
	}, []);

	const classes = useMemo(
		() =>
			tw`${css`
				& {
					--bg: var(--input-background,rgb(var(--theme-gray-input)));
					--rad: var(--input-border-radius,4px);
					--text: var(--input-color${invalid ? '-invalid' : ''},rgb(var(--theme-${invalid ? 'red-200' : 'gray-100'})));
					background-clip: content-box;

					background-color: var(--bg);
					box-shadow: 0 0 0 1000px var(--bg) inset;
					border: var(--rad) solid var(--bg);

					color: var(--text);
					caret-color: var(--text);
					-webkit-text-fill-color: var(--text);

					${settled && 'transition: color 75ms, border-color 75ms, background-color 75ms, box-shadow 75ms;'}
				}

				&:focus {
					--bg: var(--input-background-focus,rgb(var(--theme-gray-700)));
					--text: var(--input-color-focus,rgb(var(--theme-gray-100)));

					border-color: --bg;
					background-color: --bg;
					box-shadow: 0 0 0 1000px --bg inset;

					color: --text;
					caret-color: --text;
					-webkit-text-fill-color: --text;
				}

				${autofill
					? `&, &:focus {
							--text: var(--input-color-autofill,rgb(var(--theme-accent-100)));
							-webkit-text-fill-color: --text;
							caret-color: --text;
						}`
					: ''}
			`}`,
		[autofill, settled, invalid]
	);

	return [ref, classes];
}
