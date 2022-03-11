import NumberField from './NumberField';
import { TextField, PasswordField } from './TextField';
import ToggleField from './ToggleField';
import OptionField from './OptionField';

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
