import { Ref } from 'preact';

import NumberField from './NumberField';
import ToggleField from './ToggleField';
import OptionField from './OptionField';
import { Classes } from '../../../Hooks';
import DateTimeField from './DateTimeField';
import type { ValidityError } from '../useValidity';
import { TextField, PasswordField } from './TextField';

export { default as NumberField } from './NumberField';
export { TextField, PasswordField } from './TextField';
export { default as ToggleField } from './ToggleField';
export { default as OptionField } from './OptionField';
export { default as DateTimeField } from './DateTimeField';

export const Field = {
	Number: NumberField,
	Text: TextField,
	Password: PasswordField,
	Toggle: ToggleField,
	Option: OptionField,
	DateTime: DateTimeField
};

/** Basic field props for a form field. */
export type FieldProps<InputType, OutputType = InputType> = {
	id?: string;
	style?: any;
	class?: Classes;
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
