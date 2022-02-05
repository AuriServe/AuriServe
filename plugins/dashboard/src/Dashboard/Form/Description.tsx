import { forwardRef } from 'preact/compat';
import { ComponentChildren, h } from 'preact';
import { useState, useContext, useEffect } from 'preact/hooks';

import Svg from '../Svg';

import { tw } from '../twind';
import { FormContext, FormField, FormFieldMeta } from './Type';

import icon_info from '@res/icon/info.svg';
import icon_error from '@res/icon/error.svg';

interface Props {
	/** The field that this Description is for. */
	for: string;

	/** Only used by FloatingDescription, if true, will not watch for changes to validity. */
	_manual?: boolean;

	style?: any;
	class?: string;
	children?: (desc: string) => ComponentChildren;
}

function updateError(
	meta: FormFieldMeta,
	last?: { error: string; errorMessage: string | null } | null
): {
	error: string;
	errorMessage: string | null;
} | null {
	if (!meta) return null;
	if (
		meta.error &&
		(!last || meta.error !== last.error || meta.errorMessage !== last.errorMessage)
	)
		return { error: meta.error, errorMessage: meta.errorMessage };
	return meta.error ? { error: meta.error, errorMessage: meta.errorMessage } : null;
}

export default forwardRef<HTMLDivElement, Props>(function Description(props, ref) {
	const form = useContext(FormContext);

	const [error, setError] = useState<{
		error: string;
		errorMessage: string | null;
	} | null>(updateError(form.fields[props.for]));

	useEffect(() => {
		if (props._manual) return undefined;
		return form.event.bind('validity', (field: string) => {
			if (field !== props.for) return;
			setError((last) => updateError(form.fields[props.for], last));
		});
	}, [form, props.for, props._manual]);

	const schema = form.schema.fields[props.for] as FormField | undefined;

	if (!schema) throw new Error(`Description: Form does not have field '${props.for}'.`);

	return (
		<div ref={ref} style={props.style} class={props.class}>
			{props.children ? (
				props.children(schema?.description ?? '')
			) : (
				<div>
					<div class={tw`flex gap-2 p-2 pr-3 whitespace-pre-line`}>
						<Svg
							src={icon_info}
							size={6}
							class={tw`shrink-0 icon-p-accent-300 icon-s-gray-600 -mt-px`}
						/>
						{schema?.description ?? ''}
					</div>
					{error && (
						<div class={tw`p-2 bg-gray-750 rounded-b`}>
							<div class={tw`flex gap-2 text-accent-300 theme-red whitespace-pre-line`}>
								<Svg
									src={icon_error}
									size={6}
									class={tw`flex-shrink-0 icon-s-accent-400 icon-p-gray-900 -mt-px`}
								/>
								{error.errorMessage ?? error.error}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
});
