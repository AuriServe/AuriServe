import { RefObject } from 'preact';
import { useRef, useEffect, useState, useMemo } from 'preact/hooks';

import { tw, css } from '../../Twind';

interface UseAutoFillProps {
	baseBg: string;
	baseText: string;
	focusBg?: string;
	focusText?: string;
	autofillText?: string;
	borderSize: number;
}

type UseAutoFillResult = [RefObject<HTMLElement>, string];

/**
 * Styles an input element with default styles based on an invalid state, obscuring autofill styles.
 *
 * @param invalid - Whether or not the input is invalid.
 * @returns a ref object and class name to apply to the input.
 */

export default function useAutoFill(invalid: boolean): UseAutoFillResult;

/**
 * Styles an input element according to the props object specified, obscuring autofill styles.
 *
 * @param props - An object specifying the styles for the input.
 * @returns a ref object and class name to apply to the input.
 */

export default function useAutoFill(props: UseAutoFillProps): UseAutoFillResult;

/**
 * Chrome sucks ass and tries to override form styles really shittily when an input is autofilled.
 * This hook does its best to prevent that using agressively stupid CSS. Despite my best efforts,
 * I cannot make the small text that displays before any user interaction bigger,
 * as it's not rendered on the page and seems to only inherit the text color, not any other CSS properties,
 * but it's still way fucking better than nothing. Also works on Firefox fine.
 *
 * @param arg - Either a boolean to indicate that the input is invalid, or a set of props to use for the styles.
 * @returns a ref object and class name to apply to the input.
 */

export default function useAutoFill(arg: UseAutoFillProps | boolean): UseAutoFillResult {
	const ref = useRef<HTMLElement>(null);

	const props = useMemo(() => {
		if (typeof arg === 'boolean') {
			return {
				baseBg: 'rgb(var(--theme-gray-input))',
				baseText: arg ? 'rgb(var(--theme-red-200))' : 'rgb(var(--theme-gray-100))',
				focusBg: 'rgb(var(--theme-gray-700))',
				focusText: 'rgb(var(--theme-gray-100))',
				autofillText: 'rgb(var(--theme-accent-100))',
				borderSize: 4,
			};
		}

		return arg;
	}, [arg]);

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

	const {
		baseBg,
		baseText,
		focusBg = baseBg,
		focusText = baseText,
		autofillText = baseText,
		borderSize,
	} = props;

	const classes = useMemo(
		() =>
			tw`${css`
				& {
					background-clip: content-box;

					background-color: ${baseBg};
					box-shadow: 0 0 0 1000px ${baseBg} inset;
					border: ${borderSize / 16}rem solid ${baseBg};

					color: ${baseText};
					caret-color: ${baseText};
					-webkit-text-fill-color: ${baseText};

					${settled &&
					'transition: color 75ms, border-color 75ms, background-color 75ms, box-shadow 75ms;'}
				}

				&:focus {
					border-color: ${focusBg};
					background-color: ${focusBg};
					box-shadow: 0 0 0 1000px ${focusBg} inset;

					color: ${focusText};
					caret-color: ${focusText};
					-webkit-text-fill-color: ${focusText};
				}

				${autofill
					? `&, &:focus {
					-webkit-text-fill-color: ${autofillText};
					caret-color: ${autofillText};
				}`
					: ''}
			`}`,
		[autofill, settled, baseBg, baseText, focusBg, focusText, autofillText, borderSize]
	);

	return [ref, classes];
}
