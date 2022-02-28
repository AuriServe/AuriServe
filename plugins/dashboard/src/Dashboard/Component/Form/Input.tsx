import { h } from 'preact';
import { titleCase, traversePath } from 'common';
import { useRef, useContext, useEffect } from 'preact/hooks';

import Notice from './Notice';
import TextInput from './TextInput';
import OptionInput from './OptionInput';
import ToggleInput from './ToggleInput';
import PasswordInput from './PasswordInput';

import { Icon } from '../../Main';
import { FormContext, FormField, ErrorType } from './Type';

interface Props {
	for: string;

	style?: any;
	class?: string;

	rounded?: boolean;
	toggleLeft?: boolean;

	onChange?: (value: string) => void;
}

export default function Input(props: Props) {
	const ref = useRef<HTMLElement>(null);
	const form = useContext(FormContext);

	const id = `${form.id}-${props.for}`;

	let schema: FormField | undefined;
	try {
		schema = traversePath(form.schema.fields, props.for) as FormField;
	} catch (e) {
		/* If the field doesn't exist, schema is undefined. */
	}

	useEffect(() => {
		if (!schema) return;
		traversePath(form.fields, props.for).ref = ref.current;
	}, [form.fields, props.for, schema]);

	if (!schema) {
		return (
			<Notice
				icon={Icon.error}
				label='Field not found.'
				description={`Field '${props.for}' was not found. Please check the form schema.`}
			/>
		);
	}

	const handleValidity = (error: ErrorType | null, message: string | null) => {
		const field = traversePath(form.fields, props.for);
		if (field.error === error && field.errorMessage === message) return;

		field.error = error;
		field.errorMessage = message;

		form.event.emit('validity', props.for);
	};

	const handleChange = (value: any) => {
		form.onChange(props.for, value);
		props.onChange?.(value);
	};

	const handleFocus = () => {
		form.event.emit('focus', props.for);
	};

	const handleBlur = () => {
		form.event.emit('focus', null);
	};

	const value = traversePath(form.data, props.for);

	switch (schema.type) {
		case 'text':
			return (
				<TextInput
					ref={ref}
					id={id}
					label={schema.label ?? titleCase(props.for)}
					value={value}
					completion={schema.completion}
					multiline={schema.multiline}
					maxHeight={schema.maxHeight}
					optional={schema.validation?.optional}
					minLength={schema.validation?.minLength}
					maxLength={schema.validation?.maxLength}
					pattern={schema.validation?.pattern}
					patternHint={schema.validation?.patternHint}
					onChange={handleChange}
					onValidity={handleValidity}
					onFocus={handleFocus}
					onBlur={handleBlur}
					class={props.class}
					style={props.style}
				/>
			);
		case 'password':
			return (
				<PasswordInput
					ref={ref}
					id={id}
					label={schema.label ?? titleCase(props.for)}
					value={value}
					completion={schema.completion}
					optional={schema.validation?.optional}
					minLength={schema.validation?.minLength}
					maxLength={schema.validation?.maxLength}
					pattern={schema.validation?.pattern}
					patternHint={schema.validation?.patternHint}
					onChange={handleChange}
					onValidity={handleValidity}
					onFocus={handleFocus}
					onBlur={handleBlur}
					class={props.class}
					style={props.style}
				/>
			);
		case 'option':
			return (
				<OptionInput
					ref={ref}
					id={id}
					label={schema.label ?? titleCase(props.for)}
					value={value}
					options={schema.options!}
					optional={schema.validation?.optional}
					pattern={schema.validation?.pattern}
					patternHint={schema.validation?.patternHint}
					onChange={handleChange}
					onValidity={handleValidity}
					onFocus={handleFocus}
					onBlur={handleBlur}
					class={props.class}
					style={props.style}
				/>
			);
		case 'toggle':
			return (
				<ToggleInput
					ref={ref}
					id={id}
					for={props.for}
					label={schema.label ?? titleCase(props.for)}
					description={schema.description}
					icon={schema.icon}
					value={value}
					rounded={props.rounded}
					toggleLeft={props.toggleLeft}
					disabled={schema.disabled}
					optional={schema.validation?.optional}
					onChange={handleChange}
					onValidity={handleValidity}
					onFocus={handleFocus}
					onBlur={handleBlur}
					class={props.class}
					style={props.style}
				/>
			);
		default:
			return (
				<Notice
					icon={Icon.error}
					label='Unknown field type.'
					description={`Field type '${schema.type}' is unknown.`}
				/>
			);
	}
}
