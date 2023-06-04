import { useLazyRef, useRerender } from 'vibin-hooks';
import { assert, buildPath, splitPath, traversePath } from 'common';
import { MutableRef, useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'preact/hooks';

import { FieldProps } from './Field';
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
	onRef: <T extends HTMLElement>(ref: T | null) => void;
}

export default function useDerivedState<T>(
	props: FieldProps<T>,
	defaultValue?: T,
	defaultNullIfOptional?: boolean
): DerivedState<T> {
	const rerender = useRerender();
	const ctx = useContext(FormContext);
	const group = useContext(FieldGroupContext);

	const elemRef = useRef<HTMLElement | null>(null);
	const lastPathRef = useRef<string | null>(null);

	const path = useMemo(
		() => buildPath(...splitPath(group.path), ...splitPath(props.path ?? '')),
		[group.path, props.path]
	);

	const required = props.required ?? !(props.optional ?? false);
	const readonly = props.readonly ?? !(props.editable ?? true);
	const disabled =
		(props.disabled ?? !(props.enabled ?? true)) ||
		(ctx?.disabled?.current ?? false) ||
		(group?.disabled ?? false);

	const value = useLazyRef<T>(() => {
		if (props.value != null) return props.value;
		if (props.path) {
			try {
				return traversePath(ctx.value.current, path);
			} catch (_) {
				assert(
					false,
					`Could not find value for path '${path}' (on initialization).\n${JSON.stringify(
						ctx.value.current
					)}`
				);
			}
		}
		return !required && !defaultNullIfOptional ? defaultValue : null;
	});

	const refresh = useCallback(() => {
		try {
			value.current = traversePath(ctx.value.current, path);
		} catch (_) {
			assert(
				false,
				`Could not find value for path '${path}' (on refresh).\n${JSON.stringify(
					ctx.value.current
				)}`
			);
		}
		rerender();
	}, [ ctx, path, rerender, value ]);

	const id = useMemo(
		() => props.id ?? Math.random().toString(36).substring(2, 7),
		[props.id]
	);

	const label = useMemo(
		() => props.label ?? camelCaseToTitle(splitPath(path).pop() as string ?? 'UNKNOWN'),
		[props.label, path]
	);

	useLayoutEffect(() => {
		if (!path || !ctx?.event) return;
		return ctx.event.bind('refresh', (paths) => {
			if (paths.has(path)) refresh();
		});
	}, [path, ctx?.event, ctx?.value, value, rerender, refresh]);

	const onFocus = (evt: any) => {
		props.onFocus?.(evt.target);
		ctx?.event.emit('focus', path, true);
	};

	const onBlur = (evt: any) => {
		props.onBlur?.(evt.target);
		ctx?.event.emit('focus', path, false);
	};

	function updateFieldRef() {
		if (lastPathRef.current) ctx?.setFieldRef(lastPathRef.current, null);
		ctx?.setFieldRef(path, elemRef.current);
	}

	const onRef = <T extends HTMLElement>(ref: T | null) => {
		elemRef.current = ref as HTMLElement;
		updateFieldRef();
	}

	if (path && lastPathRef.current !== path) {
		requestAnimationFrame(() => ctx.event.emit('refresh', new Set([ path ])));
		updateFieldRef();
		lastPathRef.current = path;
	}

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
		onRef
	};
}
