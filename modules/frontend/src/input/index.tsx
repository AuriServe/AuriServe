/**
 * Re-exports all input widgets, as well as
 * exporting generic interfaces for all inputs.
 */


/** Labels and structural elements. */
export { default as Label } from './InputLabel';
export { default as Divider } from './InputDivider';
export { default as Annotation } from './InputAnnotation';

/** Simple inputs. */
export { default as Text } from './InputText';
// export { default as Select } from './InputSelect';
export { default as Toggle } from './InputToggle';
// export { default as Numeric } from './InputNumeric';

/** Complex inputs. */
// export { default as Media } from './InputMedia';
export { default as Color } from './InputColor';
// export { default as DateTime } from './InputDateTime';


/** The base props for an input widget. */
export interface InputProps {

	/** The current value of the input. */
	value?: any;

	/** A function to be called when the input is changed. */
	onValue?: (value: any) => void;


	/** Placeholder text to display on the input. */
	placeholder?: string;

	/** The auto completion type for the form. */
	completion?: string;

	/** Whether or not the input is enabled. */
	enabled?: boolean;

	/** Whether or not the input should be read-only. */
	readonly?: boolean;

	/** Whether or not the input is optional. */
	optional?: boolean;


	/** Styles to apply to the input. */
	style?: any;

	/** Classes to apply to the input. */
	class?: string;
}


/** The props for a textual input widget. */
export interface TextInputProps {

	/** The minimum length of the input. */
	minLength?: number;

	/** The maximum length of the input. */
	maxLength?: number;

	/** A regular expression to validate the input with. */
	pattern?: RegExp | string;

	/** The description of the pattern provided, shown when the input is not valid. */
	patternDescription?: string;
}


/** The props for a focusable input widget. */
export interface FocusableInputProps {
	/** A function to be called when the input is focused. */
	onFocus?: () => void;

	/** A function to be called when the input is blurred. */
	onBlur?: () => void;
}
