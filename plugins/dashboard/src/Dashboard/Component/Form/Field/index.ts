import { Ref } from 'preact';

import NumberField from './NumberField';
import { TextField, PasswordField } from './TextField';
import ToggleField from './ToggleField';
import OptionField from './OptionField';
import type { ValidityError } from '../useValidity';

export { default as NumberField } from './NumberField';
export { TextField, PasswordField } from './TextField';
export { default as ToggleField } from './ToggleField';
export { default as OptionField } from './OptionField';

export const Field = {
	Number: NumberField,
	Text: TextField,
	Password: PasswordField,
	Toggle: ToggleField,
	Option: OptionField,
};

/** Basic field props for a form field. */
export type FieldProps<InputType, OutputType = InputType> = {
	id?: string;
	style?: any;
	class?: string;
	fieldRef?: Ref<HTMLElement>;

	label?: string;
	description?: string;

	path?: string;
	value?: InputType;

	autofocus?: boolean;

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
