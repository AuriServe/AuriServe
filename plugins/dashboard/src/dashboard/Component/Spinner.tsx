import { h } from 'preact';

import { tw, merge } from '../Twind';

interface Props {
	/** Size of the spinner in quarter-rems, defaults to 12. */
	size?: number;

	/** Classes to apply to the component. */
	class?: string;

	/** Classes to apply to the spinner elements. */
	spinnerClass?: string;
}

export default function Spinner(props: Props) {
	return (
		<div
			class={merge(tw`relative block animate-fade-in`, props.class)}
			style={{
				width: `${(props.size ?? 12) / 4}rem`,
				height: `${(props.size ?? 12) / 4}rem`,
			}}>
			<div
				class={merge(
					tw`absolute inset-0 rounded-full bg-accent-500/25 animate-spinner-1`,
					props.spinnerClass
				)}
			/>
			<div
				class={merge(
					tw`absolute inset-0 rounded-full bg-accent-500/25 animate-spinner-2`,
					props.spinnerClass
				)}
			/>
		</div>
	);
}
