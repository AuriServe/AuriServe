import { useContext } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { ComponentChildren, h } from 'preact';

import Svg from '../Svg';

import { ErrorType, FormContext, FormField, FormFieldValidation, InputActivity } from './Type';

import icon_info from '@res/icon/info.svg';
import icon_error from '@res/icon/error.svg';

interface Props {
	for?: string;

	style?: any;
	class?: string;

	error?: InputActivity;

	children?: (desc: string) => ComponentChildren;
}

function getErrorMessage(type: ErrorType, validation: FormFieldValidation): string {
	switch (type) {
	case 'required': return 'Please fill in this field.';
	case 'minValue': return 'Must be at least ' + validation.minValue + '.';
	case 'maxValue': return 'Must be at most ' + validation.maxValue + '.';
	case 'minLength': return 'Please enter at least ' + validation.minLength + ' characters.';
	case 'maxLength': return 'Please enter at most ' + validation.maxLength + ' characters.';
	case 'pattern': return 'Please match the pattern requested.';
	default: return 'Unhandled error!';
	}
}

export default forwardRef<HTMLDivElement, Props>(function Description(props, ref) {
	const form = useContext(FormContext);

	const schema = form.schema.fields[props.for as string] as FormField | undefined;

	if (!schema) throw new Error(`Description: Form does not have field '${props.for}'.`);

	return (
		<div ref={ref} style={props.style} class={props.class}>
			{props.children ? props.children(schema?.description ?? '') :
				<div class=''>
					<div class='flex gap-2 p-2 whitespace-pre-line'>
						<Svg src={icon_info} size={6} class='flex-shrink-0 primary-300 secondary-neutral-600 -mt-px'/>
						{schema?.description ?? ''}
					</div>
					{props.error?.error && <div class='p-2 bg-neutral-750 rounded-b'>
						<div class='flex gap-2 text-accent-300 theme-red whitespace-pre-line'>
							<Svg src={icon_error} size={6} class='flex-shrink-0 secondary-400 primary-neutral-900 -mt-px'/>
							{props.error.errorMessage ?? getErrorMessage(props.error.error, schema.validation!)}
						</div>
					</div>}
				</div>
			}
		</div>
	);
});
