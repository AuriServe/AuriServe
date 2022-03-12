import { ValidityError } from './useValidity';

/** Basic field props for a form field. */
export type FieldProps<InputType, OutputType = InputType> = {
	id?: string;
	style?: any;
	class?: string;

	label?: string;
	description?: string;

	path?: string;
	value?: InputType;

	onChange?: (value: OutputType) => void;
	onValidity?: (error: ValidityError | null) => void;
	onFocus?: (elem: HTMLElement) => void;
	onBlur?: (elem: HTMLElement) => void;
} & {
	optional?: boolean;
	required?: boolean;

	enabled?: boolean;
	disabled?: boolean;

	readonly?: boolean;
	editable?: boolean;
};
