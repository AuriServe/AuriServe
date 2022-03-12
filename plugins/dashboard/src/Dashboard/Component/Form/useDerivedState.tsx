import { useRerender } from 'vibin-hooks';
import { buildPath, splitPath, traversePath } from 'common';
import { MutableRef, useContext, useEffect, useMemo, useRef } from 'preact/hooks';

import { FieldProps } from './Types';
import { camelCaseToTitle } from '../../Util';
import { FieldGroupContext } from './FieldGroup';
import { FormContext, FormContextData } from './Form';

interface DerivedState<T> {
	/** The form context. */
	ctx: FormContextData;
	/** The field's value. */
	value: MutableRef<T>;

	/** The field's unique ID. */
	id: string;
	/** The field's path, based on props and group. */
	path: string;
	/** The field's label, based on props or path. */
	label: string;

	/** Whether or not the field is required, based on props. */
	required: boolean;
	/** Whether or not the field is disabled, based on props. */
	disabled: boolean;
	/** Whether or not the field is readonly, based on props. */
	readonly: boolean;

	onFocus: (evt: Event) => void;
	onBlur: (evt: Event) => void;
}

export default function useDerivedState<T>(
	props: FieldProps<T>,
	defaultValue?: T,
	defaultNullIfOptional?: boolean
): DerivedState<T> {
	const rerender = useRerender();
	const ctx = useContext(FormContext);
	const group = useContext(FieldGroupContext);

	const path = useMemo(
		() => buildPath(...splitPath(group.path), ...splitPath(props.path ?? '')),
		[group.path, props.path]
	);

	const required = props.required ?? !(props.optional ?? false);
	const readonly = props.readonly ?? !(props.editable ?? true);
	const disabled =
		(props.disabled ?? !(props.enabled ?? true)) ||
		(ctx.disabled ?? false) ||
		(group.disabled ?? false);

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
		if (!path) return;
		return ctx.event.bind('refresh', (paths) => {
			if (paths.has(path)) {
				value.current = traversePath(ctx.value.current, path);
				rerender();
			}
		});
	}, [path, ctx, rerender]);

	const onFocus = (evt: any) => {
		props.onFocus?.(evt.target);
		ctx.event.emit('focus', path, true);
	};

	const onBlur = (evt: any) => {
		props.onBlur?.(evt.target);
		ctx.event.emit('focus', path, false);
	};

	return {
		ctx,
		value,

		id,
		path,
		label,

		required,
		disabled,
		readonly,

		onFocus,
		onBlur,
	};
}
