import { buildPath, splitPath } from 'common';
import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

/** Field group data. */
export interface FieldGroupContextData {
	path: string;
}

/** Field group context object. */
export const FieldGroupContext = createContext({ path: '' });

interface Props {
	/** The path root for this field group. */
	path: string;

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

	return (
		<FieldGroupContext.Provider value={{ path }}>
			{props.children}
		</FieldGroupContext.Provider>
	);
}
