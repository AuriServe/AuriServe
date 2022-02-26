import { buildPath, splitPath, traversePath } from 'common';
import { h, ComponentChildren } from 'preact';
import { forwardRef, memo } from 'preact/compat';
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';

import { tw } from '../../Twind';

import EventEmitter from '../../EventEmitter';
import {
	FormSchema,
	FormContext,
	FormContextData,
	FormFieldType,
	FormField,
	FormGroup,
	isGroup,
} from './Type';

export interface Props {
	schema: FormSchema;

	onChange?: (data: any, field: string, newValue: any, oldValue: any) => void;
	onSubmit?: (data: any) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const DEFAULT_VALUES: Record<FormFieldType, any> = {
	text: '',
	password: '',
	number: 0,
	toggle: false,
	option: undefined,

	media: undefined,
	color: undefined,
};

function initializeField(
	data: any,
	fields: any,
	name: string,
	schema: FormField | FormGroup
) {
	if (isGroup(schema)) {
		data[name] = {};
		fields[name] = {};
		Object.entries(schema).forEach(([cName, schema]) =>
			initializeField(data[name], fields[name], cName, schema)
		);
		return;
	}

	data[name] =
		schema.default ??
		(schema.validation?.optional ? undefined : DEFAULT_VALUES[schema.type]);
	fields[name] = { ref: null, error: null };
}

export default memo(
	forwardRef<any, Props>(function Form(props, ref) {
		console.log('render form');

		const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);
		const context = useRef<FormContextData>({
			id,
			data: {},
			onChange: null as any,
			fields: {},
			schema: props.schema,
			event: new EventEmitter(),
		});

		const { onChange: propsOnChange } = props;

		const onChange = useCallback(
			(field: string, newValue: string) => {
				const path = splitPath(field);
				const key = path.pop();
				field = buildPath(...path);

				console.log('change!');
				const obj = traversePath(context.current.data, field);
				const oldValue = obj[key!];
				obj[key!] = newValue;
				propsOnChange?.(context.current.data, field, newValue, oldValue);
			},
			[propsOnChange]
		);

		context.current.onChange = onChange;

		useMemo(() => {
			context.current.fields = {};
			Object.entries(props.schema.fields).forEach(([name, schema]) =>
				initializeField(context.current.data, context.current.fields, name, schema)
			);
			context.current.schema = props.schema;
		}, [props.schema]);

		useEffect(() => {
			if (!ref) return;
			(ref as any).current = context.current.data;
		}, [ref]);

		const handleSubmit = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();

			function findAndFocusInvalid(fields: Record<string, { ref: any; error: any }>) {
				for (const name in fields) {
					if (Object.prototype.hasOwnProperty.call(fields, name)) {
						if (fields[name].error) {
							const elem = fields[name].ref;
							elem.focus();
							elem.blur();
							elem.focus();
							return true;
						}
						if (fields[name].ref === undefined && findAndFocusInvalid(fields[name]))
							return true;
					}
				}
				return false;
			}

			if (!findAndFocusInvalid(context.current.fields)) {
				props.onSubmit?.(context.current.data);
			}
		};

		return (
			<FormContext.Provider value={context.current}>
				<form onSubmit={handleSubmit} class={props.class} style={props.style}>
					{props.children}
					<input type='submit' class={tw`sr-only`} tabIndex={-1} />
				</form>
			</FormContext.Provider>
		);
	})
);
