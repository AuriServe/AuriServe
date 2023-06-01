import { h } from 'preact';
import type { BaseClientFieldProps, BaseClientLayoutProps } from '../../Type';

export interface CheckboxFieldProps extends BaseClientFieldProps {
	type: 'checkbox';
	default?: boolean;
}

export interface CheckboxLayoutProps extends BaseClientLayoutProps {
	unused?: never;
}

export default function CheckboxField(props: { layout: CheckboxLayoutProps, field: CheckboxFieldProps }) {
	return (
		<div class='forms:form-field checkbox'>
			<label for={props.field.id}>{props.field.label}</label>
			<input
				type='checkbox'
				id={props.field.id}
				name={props.field.id}
				defaultChecked={props.field.default ?? undefined}
				required={props.field.constraints?.required ?? false}
			/>
		</div>
	);
}
