import { splitPath, traversePath } from 'common';
import { FieldProps, FormContext, FormContextData } from './Types';
import { MutableRef, useContext, useEffect, useMemo, useRef } from 'preact/hooks';
import { camelCaseToTitle } from '../../Util';

interface DerivedState<T> {
	ctx: FormContextData;
	value: MutableRef<T>;

	id: string;
	label: string;

	required: boolean;
	disabled: boolean;
	readonly: boolean;
}

export function useDerivedState<T>(
	props: FieldProps<T>,
	defaultValue?: string
): DerivedState<T> {
	const ctx = useContext(FormContext);

	const value = useRef<T>(
		props.value ??
			(props.path && traversePath(ctx.value.current, props.path)) ??
			defaultValue
	);

	const id = useMemo(
		() => props.id ?? Math.random().toString(36).substring(2, 7),
		[props.id]
	);

	const label = useMemo(
		() => props.label ?? camelCaseToTitle(splitPath(props.path!).pop() as string),
		[props.label, props.path]
	);

	useEffect(() => {
		if (!props.path) return;
		ctx.event.bind('refresh', () => {
			value.current = traversePath(ctx.value.current, props.path!);
		});
	}, [props.path, ctx]);

	return {
		ctx,
		value,

		id,
		label,

		required: props.required ?? !(props.optional ?? false),
		disabled: props.disabled ?? !(props.enabled ?? true),
		readonly: props.readonly ?? !(props.editable ?? true),
	};
}
