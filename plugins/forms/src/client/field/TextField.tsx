import { h } from 'preact';
import type { BaseClientFieldProps, BaseClientLayoutProps } from '../../Type';

export interface TextFieldProps extends BaseClientFieldProps {
	type: 'text' | 'email' | 'tel';
	default?: string;
	constraints?: BaseClientFieldProps['constraints'] & {
		pattern?: string;
		minLength?: number;
		maxLength?: number;
	}
};

export interface TextLayoutProps extends BaseClientLayoutProps {
	unused?: never;
};

export default function TextField(props: { layout: TextLayoutProps, field: TextFieldProps }) {
	return (
		<div class='forms:form-field text'>
			<label for={props.field.id}>{props.field.label}</label>
			<input
				type={props.field.type}
				id={props.field.id}
				name={props.field.id}
				placeholder={props.field.placeholder}
				defaultValue={props.field.default ?? undefined}
				required={props.field.constraints?.required ?? true}
				pattern={props.field.constraints?.pattern ?? undefined}
			/>
		</div>
	);
}
