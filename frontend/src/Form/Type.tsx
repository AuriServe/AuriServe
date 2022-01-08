import { createContext } from 'preact';

import EventEmitter from '../EventEmitter';

/** The form field type. */
export type FormFieldType =
	| 'text'
	| 'password'
	| 'media'
	| 'color'
	| 'number'
	| 'toggle'
	| 'option';

/** Describes the types of validation to be performed by the form field. */
export interface FormFieldValidation {
	/** If the field should be optional. */
	optional?: boolean;

	/** Minimum text length. */
	minLength?: number;

	/** Maximum text length. */
	maxLength?: number;

	/** Minimum number value. */
	minValue?: number;

	/** Maximum number value. */
	maxValue?: number;

	/** A regular expression to test against the value. */
	pattern?: RegExp;

	/** A hint to display if the field doesn't match the pattern provided. */
	patternHint?: string;

	/** A file type or array of file types to match. */
	type?: string | string[];
}

/** A form field specifier. */
export interface FormField {
	/** The type of the field. */
	type: FormFieldType;

	/** The label for the field. */
	label?: string;

	/** The description for the field. */
	description?: string;

	/** The default value for the field. */
	default?: any;

	/** An autocomplete label indicating the field's completion type. */
	completion?: string;

	/** For text fields, whether or not the text should be able to have multiple lines. */
	multiline?: boolean;

	/** For multiline text fields, the max height of the textarea. */
	maxHeight?: number;

	/** For option fields, the options you can select from. */
	options?: Record<string, string>;

	/** The minimum rows of the multiline input. */
	minRows?: number;

	/** Validation to be performed on the field. */
	validation?: FormFieldValidation;
}

export function isGroup(field: FormField | FormGroup): field is FormGroup {
	return field.type === undefined;
}

/** An object containing form field definitions. */
export type FormGroup = { [key: string]: FormField | FormGroup };

export interface FormSchema {
	/** The fields that the form should have. */
	fields: FormGroup;
}

export interface FormFieldMeta {
	ref: HTMLElement | null;
	error: ErrorType | null;
	errorMessage: string | null;
}

/** Form context interface. */
export interface FormContextData {
	id: string;
	data: Record<string, any>;
	fields: Record<string, FormFieldMeta>;
	schema: FormSchema;
	event: EventEmitter;
}

/** Context containing form information. */
export const FormContext = createContext<FormContextData>(null as any);

/** Input Error Types */
export type ErrorType = 'pattern' | 'maxValue' | 'minValue' | 'minLength' | 'maxLength' | 'required';
