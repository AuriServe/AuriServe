import { buildPath, splitPath } from 'common';
import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

/** Field group data. */
export interface FieldGroupContextData {
	path: string;
	disabled: boolean;
}

/** Field group context object. */
export const FieldGroupContext = createContext({ path: '', disabled: false });

interface Props {
	/** The path root for this field group. */
	path: string;

	/** Whether or not the child fields should be disabled. */
	disabled?: boolean;

	/** The field group's children. */
	children: ComponentChildren;
}

/**
 * Accepts a path and makes all child Fields and FieldGroups relative to it.
 */

export default function FieldGroup(props: Props) {
	const ctx = useContext(FieldGroupContext);
	const path = useMemo(
		() => buildPath(...splitPath(ctx.path), ...splitPath(props.path)),
		[ctx.path, props.path]
	);

	const disabled = props.disabled ?? ctx.disabled;

	return (
		<FieldGroupContext.Provider value={{ path, disabled }}>
			{props.children}
		</FieldGroupContext.Provider>
	);
}
