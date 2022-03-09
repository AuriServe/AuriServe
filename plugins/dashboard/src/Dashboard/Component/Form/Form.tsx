import { memo } from 'preact/compat';
import { h, ComponentChildren } from 'preact';
import { useMemo, useRef } from 'preact/hooks';
import { buildPath, splitPath, traversePath } from 'common';

import FloatingDescription from './FloatingDescription';

import { tw } from '../../Twind';
import { DeepPartial } from '../../Util';
import EventEmitter from '../../EventEmitter';
import { FormContext, EventType } from './Types';

export interface Props<T> {
	/** For uncontrolled forms. */
	initialValue?: DeepPartial<T>;

	/** For controlled forms. */
	value?: DeepPartial<T>;

	onChange?: (value: DeepPartial<T>) => void;
	onSubmit?: (value: T) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default memo(function Form<ValueType>(props: Props<ValueType>) {
	console.log('render form');

	const formRef = useRef<HTMLFormElement>(null);
	const refs = useRef<Record<string, HTMLElement | undefined>>({});
	const value = useRef<DeepPartial<ValueType>>({
		...(props.initialValue ?? props.value ?? {}),
	} as DeepPartial<ValueType>);

	const { onChange: propsOnChange } = props;
	const event = useMemo(() => {
		const event = new EventEmitter<EventType>();
		event.bind('change', (path, newValue) => {
			const pathArr = splitPath(path);
			const lastSeg = pathArr.pop()!;
			const container = traversePath(value.current, buildPath(...pathArr));
			container[lastSeg] = newValue;
			propsOnChange?.({ ...value.current });
		});

		// console.log(
		// 	Object.fromEntries(
		// 		Object.entries(formRef.current!.elements).filter(
		// 			([key, control]) => (control as any).name === key
		// 		)
		// 	)
		// );
		// });
		return event;
	}, [propsOnChange]);

	useMemo(() => {
		if (!props.value) return;
		value.current = props.value;
		event.emit('refresh');
	}, [props.value, event]);

	const ctx = { value, refs, event };

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();

		console.warn("submit doesn't error check yet");
		props.onSubmit?.({ ...value.current } as ValueType);
		// function findAndFocusInvalid(fields: Record<string, { ref: any; error: any }>) {
		// 	for (const name in fields) {
		// 		if (Object.prototype.hasOwnProperty.call(fields, name)) {
		// 			if (fields[name].error) {
		// 				const elem = fields[name].ref;
		// 				elem.focus();
		// 				elem.blur();
		// 				elem.focus();
		// 				return true;
		// 			}
		// 			if (fields[name].ref === undefined && findAndFocusInvalid(fields[name]))
		// 				return true;
		// 		}
		// 	}
		// 	return false;
		// }

		// if (!findAndFocusInvalid(context.current.fields)) {
		// 	props.onSubmit?.(context.current.data);
		// }
	};

	return (
		<FormContext.Provider value={ctx}>
			<form ref={formRef} onSubmit={handleSubmit} class={props.class} style={props.style}>
				{props.children}
				<input type='submit' class={tw`sr-only`} tabIndex={-1} />
				<FloatingDescription position='right' />
			</form>
		</FormContext.Provider>
	);
});
