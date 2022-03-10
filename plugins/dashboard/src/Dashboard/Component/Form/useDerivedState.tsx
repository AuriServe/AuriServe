import { buildPath, splitPath, traversePath } from 'common';
import { MutableRef, useContext, useEffect, useMemo, useRef } from 'preact/hooks';

import { FieldGroupContext } from './FieldGroup';
import { camelCaseToTitle } from '../../Util';
import { FieldProps, FormContext, FormContextData } from './Types';

interface DerivedState<T> {
	ctx: FormContextData;
	value: MutableRef<T>;

	id: string;
	path: string;
	label: string;

	required: boolean;
	disabled: boolean;
	readonly: boolean;
}

export function useDerivedState<T>(
	props: FieldProps<T>,
	defaultValue?: T,
	defaultNullIfOptional?: boolean
): DerivedState<T> {
	const ctx = useContext(FormContext);
	const group = useContext(FieldGroupContext);

	const path = useMemo(
		() => buildPath(...splitPath(group.path), ...splitPath(props.path ?? '')),
		[group.path, props.path]
	);

	const required = props.required ?? !(props.optional ?? false);
	const disabled = props.disabled ?? !(props.enabled ?? true);
	const readonly = props.readonly ?? !(props.editable ?? true);

	const value = useRef<T>(
		props.value ??
			(props.path && traversePath(ctx.value.current, path)) ??
			(!required && !defaultNullIfOptional ? defaultValue : null)
	);

	const id = useMemo(
		() => props.id ?? Math.random().toString(36).substring(2, 7),
		[props.id]
	);

	const label = useMemo(
		() => props.label ?? camelCaseToTitle(splitPath(path).pop() as string),
		[props.label, path]
	);

	useEffect(() => {
		if (path) return;
		ctx.event.bind('refresh', () => {
			value.current = traversePath(ctx.value.current, path);
		});
	}, [path, ctx]);

	return {
		ctx,
		value,

		id,
		path,
		label,

		required,
		disabled,
		readonly,
	};
}
