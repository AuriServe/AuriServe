import { FunctionComponent } from 'preact';

import { DashboardFieldProps } from '../../Type';

import CheckboxField from './CheckboxField';
import SelectField from './SelectField';
import TextField from './TextField';

export const Components: { [K in DashboardFieldProps['type']]: FunctionComponent<any> } = {
	text: TextField,
	tel: TextField,
	email: TextField,
	textarea: TextField,
	select: SelectField,
	checkbox: CheckboxField
};

export { default as CheckboxField } from './CheckboxField';
export { default as SelectField } from './SelectField';
export { default as TextField } from './TextField';
