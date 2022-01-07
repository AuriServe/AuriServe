import { h } from 'preact';
import { titleCase } from 'common';
import { useRef, useContext, useEffect } from 'preact/hooks';

import { FormContext, FormField, ErrorType } from './Type';

import TextInput from './TextInput';
import OptionInput from './OptionInput';
import ToggleInput from './ToggleInput';

interface Props {
	for: string;

	style?: any;
	class?: string;

	rounded?: boolean;
	toggleLeft?: boolean;

	onChange?: (value: string) => void;
}

export default function Input(props: Props) {
	const ref = useRef<HTMLInputElement>(null);
	const form = useContext(FormContext);

	const id = `${form.id}-${props.for}`;
	const schema = form.schema.fields[props.for] as FormField;
	if (!schema) throw new Error(`Input: Form does not have field '${props.for}'.`);

	useEffect(() => {
		form.fields[props.for].ref = ref.current;
	}, [ form.fields, props.for ]);

	const handleValidity = (error: ErrorType | null, message: string | null) => {
		if (form.fields[props.for].error === error && form.fields[props.for].errorMessage === message) return;

		form.fields[props.for].error = error;
		form.fields[props.for].errorMessage = message;

		form.event.emit('validity', props.for);
	};

	const handleChange = (value: string) => {
		form.data[props.for] = value;
		props.onChange?.(value);
	};

	const handleFocus = () => {
		form.event.emit('focus', props.for);
	};

	const handleBlur = () => {
		form.event.emit('focus', null);
	};

	switch (schema.type) {
	case 'text':
		return (
			<TextInput
				ref={ref}
				id={id}
				label={schema.label ?? titleCase(props.for)}
				multiline={schema.multiline}
				maxHeight={schema.maxHeight}
				value={form.data[props.for]}
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
				value={form.data[props.for]}
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
				rounded={props.rounded}
				toggleLeft={props.toggleLeft}
				label={schema.label ?? titleCase(props.for)}
				value={form.data[props.for]}
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
		throw `Input: Unknown form type '${schema.type}.`;
	}
}
