import { h } from 'preact';
import type { BaseClientFieldProps, BaseClientLayoutProps } from '../../Type';

export interface TextAreaFieldProps extends BaseClientFieldProps {
	type: 'textarea';
	default?: string;
	constraints?: BaseClientFieldProps['constraints'] & {
		pattern?: string;
		minLength?: number;
		maxLength?: number;
	}
};

export interface TextAreaLayoutProps extends BaseClientLayoutProps {
	lines?: number;
}

export default function TextAreaField(props: { layout: TextAreaLayoutProps, field: TextAreaFieldProps }) {
	return (
		<div class='forms:form-field textarea'>
			<label for={props.field.id}>{props.field.label}</label>
			<textarea
				id={props.field.id}
				name={props.field.id}
				placeholder={props.field.placeholder}
				defaultValue={props.field.default ?? undefined}
				required={props.field.constraints?.required ?? true}
				pattern={props.field.constraints?.pattern ?? undefined}
				rows={props.layout.lines ?? 3}
			/>
		</div>
	);
}
