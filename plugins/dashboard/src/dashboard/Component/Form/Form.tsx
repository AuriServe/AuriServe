import { h, ComponentChildren } from 'preact';
import { memo, createContext } from 'preact/compat';
import { useMemo, useRef, MutableRef, useCallback } from 'preact/hooks';
import { buildPath, splitPath, traversePath } from 'common';

import FloatingDescription from './FloatingDescription';

import { tw } from '../../Twind';
import { DeepPartial } from '../../Util';
import EventEmitter from '../../EventEmitter';

import { ValidityError } from './useValidity';

declare function structuredClone<T>(v: T): T;
// structuredClone ??= (v: unknown) => JSON.parse(JSON.stringify(v));;

/** Event types for Form event emitter. */
export interface EventType {
	change: (path: string, value: any) => void;
	focus: (path: string, focused: boolean) => void;
	validity: (path: string, error: ValidityError | null) => void;
	refresh: (paths: Set<string>) => void;
	submit: () => void;
}

/** Supporting data about a form field. */
export interface FieldMeta {
	/** The field's form control, to be programatically focused if needed. */
	elem: HTMLElement | null;

	/** The field's error state, if any. */
	error: ValidityError | null;
}

/** Form context interface. */
export interface FormContextData {
	value: MutableRef<any>;
	meta: MutableRef<Record<string, FieldMeta | undefined>>;
	event: EventEmitter<EventType>;
	disabled: MutableRef<boolean>;
	setFieldRef: <T extends HTMLElement>(path: string, elem: T | null) => void;
}

/** Context containing form information. */
export const FormContext = createContext<FormContextData>(null as any);

/** Hooks to work with the form from outside of it. */
export interface FormHooks<T> {
	setValue(value: DeepPartial<T>): void;
	submit(): void;
}

export interface Props<T> {
	/** For uncontrolled forms. */
	initialValue?: DeepPartial<T>;

	/** For controlled forms. */
	value?: DeepPartial<T>;

	/** Whether or not fields should be disabled. */
	disabled?: boolean;

	/** Don't show floating description. */
	noDescription?: boolean;

	hooks?: MutableRef<FormHooks<T>>;
	onChange?: (value: DeepPartial<T>) => void;
	onSubmit?: (value: T) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

function findPathsToRefresh(
	oldData: Record<string, unknown> | unknown[] | undefined,
	newData: Record<string, unknown> | unknown[],
	path = '',
	acc?: Set<string>
) {
	acc ??= new Set();

	function handleValue(oldValue: unknown, newValue: unknown, path: string) {
		if (newValue && typeof newValue === 'object') {
			findPathsToRefresh(
				oldValue as Record<string, unknown>,
				newValue as Record<string, unknown>,
				path,
				acc
			);
		} else if (Array.isArray(newValue)) {
			findPathsToRefresh(oldValue as unknown[], newValue, path, acc);
		} else if (oldValue !== newValue) {
			acc!.add(path);
		}
	}

	if (Array.isArray(newData)) {
		for (let i = 0; i < newData.length; i++) {
			handleValue((oldData as unknown[] | undefined)?.[i], newData[i], `${path}[${i}]`);
		}
	} else if (newData && typeof newData === 'object') {
		for (const [key, value] of Object.entries(newData)) {
			handleValue(
				(oldData as Record<string, unknown> | undefined)?.[key],
				value,
				path ? `${path}.${key}` : key
			);
		}
	}

	return acc;
}

export default memo(function Form<ValueType>(props: Props<ValueType>) {
	const formRef = useRef<HTMLFormElement>(null);
	const meta = useRef<Record<string, FieldMeta | undefined>>({});
	const value = useRef<DeepPartial<ValueType>>(
		JSON.parse(
			JSON.stringify(props.initialValue ?? props.value ?? {})
		) as DeepPartial<ValueType>
	);

	const propsOnChange = useRef<((value: DeepPartial<ValueType>) => void) | null>();
	propsOnChange.current = props.onChange;

	const event = useMemo(() => {
		const event = new EventEmitter<EventType>();
		event.bind('change', (path, newValue) => {
			const pathArr = splitPath(path);
			const key = pathArr.pop()!;

			const newData = structuredClone(value.current);
			const container = traversePath(newData, buildPath(...pathArr));
			container[key] = newValue;
			value.current = newData;
			propsOnChange.current?.(newData);
		});

		event.bind('validity', (path, error) => {
			if (meta.current[path]) meta.current[path]!.error = error;
		});

		return event;
	}, []);

	const setValue = useCallback(
		(newValue: DeepPartial<ValueType>) => {
			if (value.current !== newValue) {
				const dirtyPaths = findPathsToRefresh(value.current as any, newValue as any);
				value.current = newValue;
				event.emit('refresh', dirtyPaths);
				propsOnChange.current?.(newValue);
			}
		},
		[event]
	);

	const setFieldRef = useCallback(
		<T extends HTMLElement>(path: string, elem: T | null) => {
			if (elem) {
				if (!meta.current[path]) meta.current[path] = { elem: null, error: null };
				meta.current[path]!.elem = elem;
			} else {
				delete meta.current[path];
			}
		},
		[]
	);

	if (props.value) setValue(props.value);

	const disabled = useRef<boolean>(props.disabled ?? false);
	disabled.current = props.disabled ?? false;

	const ctx = useMemo(
		() => ({ value, meta, event, disabled, setFieldRef }),
		[value, meta, event, disabled, setFieldRef]
	);

	const handleSubmit = (e?: Event) => {
		e?.preventDefault();
		e?.stopPropagation();

		event.emit('submit');
		// console.log("we're gonna submit", value.current);

		let foundError = false;
		for (const [path, field] of Object.entries(meta.current)) {
			if (field?.error) {
				console.warn('error on field', path);
				field.elem?.focus();
				foundError = true;
				break;
			}
		}

		if (foundError) return;
		props.onSubmit?.(JSON.parse(JSON.stringify(value.current)));
	};

	if (props.hooks) props.hooks.current = { setValue, submit: handleSubmit };

	return (
		<FormContext.Provider value={ctx}>
			<form ref={formRef} onSubmit={handleSubmit} class={props.class} style={props.style}>
				{props.children}
				<input
					type='submit'
					class={tw`sr-only`}
					tabIndex={-1}
					disabled={props.disabled}
				/>
				{!props.noDescription && <FloatingDescription position='right' />}
			</form>
		</FormContext.Provider>
	);
});
