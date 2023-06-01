import { FunctionComponent } from 'preact';

import { ClientFieldProps } from '../../Type';

import CheckboxField from './CheckboxField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';
import TextField from './TextField';

export const Components: { [K in ClientFieldProps["type"]]: FunctionComponent<any> } = {
	text: TextField,
	tel: TextField,
	email: TextField,
	textarea: TextAreaField,
	select: SelectField,
	checkbox: CheckboxField
};

export { default as CheckboxField } from './CheckboxField';
export { default as SelectField } from './SelectField';
export { default as TextAreaField } from './TextAreaField';
export { default as TextField } from './TextField';
