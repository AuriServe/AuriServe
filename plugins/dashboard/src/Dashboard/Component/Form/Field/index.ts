import ToggleField from './ToggleField';
import OptionField from './OptionField';
import { TextField, PasswordField } from './TextField';

export { default as ToggleField } from './ToggleField';
export { default as OptionField } from './OptionField';
export { TextField, PasswordField } from './TextField';

export const Field = {
	Toggle: ToggleField,
	Option: OptionField,
	Text: TextField,
	Password: PasswordField,
};
