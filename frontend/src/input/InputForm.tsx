import { h, ComponentChildren } from 'preact';
import { forwardRef } from 'preact/compat';

interface Props {
	onSubmit?: () => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Calls the specified function when the form is submitted.
 * Never navigates to a different page, because what form in 2020 does that?
 */

export default forwardRef<HTMLFormElement, Props>(function InputForm(props, ref) {
	const handleSubmit = (evt: any): boolean => {
		props.onSubmit?.();
		evt.preventDefault();
		return false;
	};

	return (
		<form ref={ref} class={props.class} style={props.style} onSubmit={handleSubmit}>
			{props.children}
		</form>
	);
});
