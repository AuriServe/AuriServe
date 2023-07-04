import type { CheckboxFieldProps, CheckboxLayoutProps as CheckboxClientLayoutProps } from
	'./client/field/CheckboxField';
import type { SelectFieldProps, SelectLayoutProps as SelectClientLayoutProps } from
	'./client/field/SelectField';
import type { TextAreaFieldProps, TextAreaLayoutProps as TextAreaClientLayoutProps } from
	'./client/field/TextAreaField';
import type { TextFieldProps, TextLayoutProps as TextClientLayoutProps } from
	'./client/field/TextField';
import type { TextFieldProps as TextDashboardFieldProps } from
	'./dashboard/field/TextField';
import type { SelectFieldProps as SelectDashboardFieldProps } from
	'./dashboard/field/SelectField';
import type { CheckboxFieldProps as CheckboxDashboardFieldProps } from
	'./dashboard/field/CheckboxField';

export interface BaseClientFieldProps {
	id: string;
	label: string;
	placeholder?: string;
	description?: string;
	shortName?: string;
	constraints?: {
		required?: boolean;
	}
}

export interface BaseDashboardFieldProps<
	V,
	L extends BaseDashboardLayoutProps = BaseDashboardLayoutProps,
	F extends BaseClientFieldProps = BaseClientFieldProps> {
	label: string;
	value: V;
	layout: L;
	field: F
}

export type BaseClientLayoutProps = {
	row?: number;
	col?: number;
	rowSpan?: number;
	colSpan?: number;
	id: Omit<string, "#text" | "#submit" | "#element" | "#html">;
}

export type InlineTextClientLayoutProps = BaseClientLayoutProps & {
	type: "#text";
	content: 'string';
}

export type SubmitClientLayoutProps = BaseClientLayoutProps & {
	type: "#submit";
	label: string;
}

export type ElementClientLayoutProps = BaseClientLayoutProps & {
	type: "#element";
	index: number;
}

export type HtmlClientLayoutProps = BaseClientLayoutProps & {
	type: "#html";
	content: string;
}

export type SpaceClientLayoutProps = BaseClientLayoutProps & {
	type: "#space";
	width?: number;
}

export type BaseDashboardLayoutProps = {
	row?: number;
	col?: number;
	rowSpan?: number;
	colSpan?: number;
	id: string;
}

export type SpaceDashboardLayoutProps = BaseDashboardLayoutProps & {
	type: "#space";
	size?: number;
}

export type ClientFieldProps = CheckboxFieldProps | SelectFieldProps | TextAreaFieldProps | TextFieldProps;
export type ClientLayoutProps = CheckboxClientLayoutProps | SelectClientLayoutProps | TextAreaClientLayoutProps
	| TextClientLayoutProps | InlineTextClientLayoutProps | SubmitClientLayoutProps | ElementClientLayoutProps
	| HtmlClientLayoutProps | SpaceClientLayoutProps;

export type DashboardFieldProps = TextDashboardFieldProps | CheckboxDashboardFieldProps | SelectDashboardFieldProps;
export type DashboardLayoutProps = BaseDashboardLayoutProps;

export type { CheckboxFieldProps as CheckboxClientFieldProps, CheckboxLayoutProps as CheckboxClientLayoutProps } from
	'./client/field/CheckboxField';
export type { SelectFieldProps as SelectClientFieldProps, SelectLayoutProps as SelectClientLayoutProps } from
	'./client/field/SelectField';
export type { TextAreaFieldProps as TextAreaClientFieldProps, TextAreaLayoutProps as TextAreaClientLayoutProps } from
	'./client/field/TextAreaField';
export type { TextFieldProps as TextClientFieldProps, TextLayoutProps as TextClientLayoutProps } from
	'./client/field/TextField';

export type { CheckboxFieldProps as CheckboxDashboardFieldProps } from
	'./dashboard/field/CheckboxField';
export type { SelectFieldProps as SelectDashboardFieldProps } from
	'./dashboard/field/SelectField';
export type { TextFieldProps as TextDashboardFieldProps } from
	'./dashboard/field/TextField';

export type Form = {
	id: number;
	name: string;
	fields: ClientFieldProps[];

	server?: {
		mailTo?: string[];
	}

	client: {
		layout?: ClientLayoutProps[];
		gap?: [ number, number ];
		columns?: number;
	}

	dashboard: {
		reply?: string;
		columns?: { id: string, maxWidth?: number }[];
		layoutColumns?: number;
		layout: DashboardLayoutProps[];
	}

}
