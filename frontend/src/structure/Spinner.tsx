import { h } from 'preact';
import { merge } from 'common/util';

interface Props {
	/** Size of the spinner, defaults to 48. */
	size?: number;

	/** Classes to apply to the component. */
	class?: string;

	/** Classes to apply to the spinner elements. */
	spinnerClass?: string;
}

export default function Spinner(props: Props) {
	return (
		<div class={merge('relative block', props.class)} style={{ width: props.size ?? 48, height: props.size ?? 48 }}>
			<div class={merge('absolute inset-0 rounded-full bg-blue-500/25 animate-spinner-1', props.spinnerClass)} />
			<div class={merge('absolute inset-0 rounded-full bg-blue-500/25 animate-spinner-2', props.spinnerClass)} />
		</div>
	);
}
