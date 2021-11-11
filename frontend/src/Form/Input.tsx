import { h } from 'preact';
import { titleCase } from 'common/Format';
import { mergeClasses } from 'common/util';
import { useRef, useContext, useState } from 'preact/hooks';

// import Svg from '../Svg';
import { FormContext, FormField, ErrorType, getErrorType } from './Type';

// import icon_error from '@res/icon/error.svg';

function regexToPattern(regex: RegExp | string): string {
	regex = regex.toString();
	if (regex.startsWith('/')) regex = regex.substr(1);
	if (regex.startsWith('^')) regex = regex.substr(1);
	if (regex.endsWith('/')) regex = regex.substr(0, regex.length - 1);
	if (regex.endsWith('$')) regex = regex.substr(0, regex.length - 1);
	return regex;
}

interface Props {
	for: string;

	style?: any;
	class?: string;

	onChange?: (value: string) => void;
}

export default function Input(props: Props) {
	const ref = useRef<HTMLElement>(null);
	const form = useContext(FormContext);

	const [ error, setError ] = useState<ErrorType | null>(null);

	const id = form.id + '-' + props.for;
	const schema = form.schema.fields[props.for] as FormField;

	if (!schema) throw new Error(`Input: Form does not have field '${props.for}'.`);

	const Tag = schema.multiline ? 'textarea' : 'input';

	const checkValidity = (sendEvent?: boolean) => {
		const error = getErrorType((ref.current as HTMLInputElement).validity);
		setError(error);

		if (sendEvent) form.event.emit('activity', {
			name: props.for,
			target: ref.current,
			error: error,
			errorMessage: error === 'pattern' ? schema.validation?.patternHint : undefined
		});
	};

	const handleChange = (e: Event) => {
		const value = Tag === 'input' ? (e.target as HTMLInputElement).value : (e.target as HTMLTextAreaElement).innerText;
		form.fields[props.for] = value;
		props.onChange?.(value);

		if (error) checkValidity(true);
	};

	const handleInvalid = (e: Event) => {
		e.preventDefault();
		checkValidity(document.activeElement === ref.current);
	};

	const handleFocus = () => {
		form.event.emit('activity', {
			name: props.for,
			target: ref.current,
			error: error,
			errorMessage: error === 'pattern' ? schema.validation?.patternHint : undefined
		});
	};

	const handleBlur = () => {
		form.event.emit('activity', null);
		checkValidity();
	};

	return (
		<div class={mergeClasses('relative group isolate grid w-full h-max ', props.class)} style={props.style}>
			<Tag ref={ref as any} id={id} type='text' placeholder=' '
				class={mergeClasses('peer w-full px-2.5 pt-6 pb-1 pr-10 rounded',
					'!outline-none resize-none transition focus:shadow-md',
					'bg-neutral-100 dark:bg-neutral-700/75 dark:focus:bg-neutral-700',
					error && 'text-red-800 focus:text-neutral-900',
					error && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-neutral-100')}
				onInput={handleChange}
				onInvalid={handleInvalid}
				onFocus={handleFocus}
				onBlur={handleBlur}
				value={Tag === 'input' ? form.fields[props.for] : undefined}
				minLength={schema.validation?.minLength}
				maxLength={schema.validation?.maxLength}
				required={!schema.validation?.optional}
				pattern={schema.validation?.pattern ? regexToPattern(schema.validation.pattern) : undefined}
			>
				{Tag === 'textarea' ? form.fields[props.for] : undefined}
			</Tag>

			<label for={id}
				class={mergeClasses('absolute transition-all w-full interact-none',
					'top-1.5 peer-focus:top-1.5 peer-placeholder-shown:top-[0.9375rem]',
					'left-2.5 peer-focus:left-2.5 peer-placeholder-shown:left-3',
					'text-xs peer-focus:text-xs peer-placeholder-shown:text-base',
					'font-bold peer-focus:font-bold peer-placeholder-shown:font-medium',
					!error && 'text-neutral-500 peer-hover:text-neutral-500 peer-focus:text-accent-600',
					!error && 'dark:text-neutral-300 dark:peer-hover:text-neutral-200 dark:peer-focus:text-accent-300',
					error && 'text-red-900 peer-hover:text-red-800/75 peer-focus:text-red-800',
					error && 'dark:text-red-400 dark:peer-hover:text-red-300 dark:peer-focus:text-red-300')}>
				{schema.label ?? titleCase(props.for)}
			</label>

			{/* {error && <Svg src={icon_error} size={6} class='absolute top-3.5 right-2.5 primary-300 secondary-neutral-600
				opacity-0 group-hover:opacity-50 peer-focus:opacity-70 transition'/>} */}

			<div style={{ transformOrigin: '25%' }}
				class={mergeClasses('absolute bottom-0 w-full h-0.5 rounded-b transition-all',
					'opacity-0 peer-focus:opacity-100',
					'scale-x-75 peer-focus:scale-x-100',
					!error && 'bg-accent-500 dark:bg-accent-400',
					error && 'bg-red-700/75 dark:bg-red-300')}/>
		</div>
	);
}
