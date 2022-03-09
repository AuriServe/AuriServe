import { createContext } from 'preact';
import { MutableRef } from 'preact/hooks';

import EventEmitter from '../../EventEmitter';

/** Event types for Form event emitter. */
export interface EventType {
	change: (path: string, value: any) => void;
	focus: (path: string | null) => void;
	refresh: () => void;
}

/** Form context interface. */
export interface FormContextData {
	value: MutableRef<any>;
	refs: MutableRef<Record<string, HTMLElement | undefined>>;
	event: EventEmitter<EventType>;
}

/** Context containing form information. */
export const FormContext = createContext<FormContextData>(null as any);

/** Input Error Types */
export type ErrorType =
	| 'pattern'
	| 'maxValue'
	| 'minValue'
	| 'minLength'
	| 'maxLength'
	| 'required';

/** A form field validation error. */
export interface ValidityError {
	type: ErrorType;
	message: string;
}

/** Basic field props for a form field. */
export type FieldProps<InputType, OutputType = InputType> = {
	id?: string;
	style?: any;
	class?: string;

	label?: string;
	description?: string;

	path?: string;
	value?: InputType;

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
