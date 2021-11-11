import { h, ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

import EventEmitter from '../EventEmitter';
import { FormSchema, FormContext, FormContextData, FormFieldType, FormField, FormGroup, isGroup } from './Type';

export interface Props {
	schema: FormSchema;

	onSubmit?: (data: any) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const DEFAULT_VALUES: Record<FormFieldType, any> = {
	['text']: '',
	['number']: 0,
	['toggle']: false,

	['media']: undefined,
	['color']: undefined
};

function initializeField(data: any, name: string, schema: FormField | FormGroup) {
	if (isGroup(schema)) {
		data[name] = {};
		Object.entries(schema).forEach(([ cName, schema ]) => initializeField(data[name], cName, schema));
		return;
	}

	const defaultValue = schema.default ?? (schema.validation?.optional ? undefined : DEFAULT_VALUES[schema.type]);
	data[name] = defaultValue;
};

export default forwardRef<any, Props>(function Form(props, ref) {
	const data = useRef<any>({});

	const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);
	const context = useRef<FormContextData>({
		id,
		fields: {},
		schema: props.schema,
		event: new EventEmitter()
	});

	useEffect(() => {
		context.current.fields = {};
		Object.entries(props.schema.fields).forEach(([ name, schema ]) =>
			initializeField(context.current.fields, name, schema));
	}, [ props.schema ]);

	useEffect(() => {
		if (!ref) return;
		ref.current = data.current;
	}, [ ref ]);

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		props.onSubmit?.(data);
	};

	return (
		<FormContext.Provider value={context.current}>
			<form onSubmit={handleSubmit} class={props.class} style={props.style}>
				{props.children}
				<input type='submit' class='sr-only' tabIndex={-1}/>
			</form>
		</FormContext.Provider>
	);
});
