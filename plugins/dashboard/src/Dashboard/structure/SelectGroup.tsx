import { h, createContext, ComponentChildren } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export interface SelectGroupContextData {
	selected: number[];
	onSelect(ind: number, state?: boolean): void;
}

export const SelectGroupContext = createContext<SelectGroupContextData>({
	selected: [],
	onSelect: () => {
		/* No action for default context. */
	},
});

interface Props {
	selected: number[];
	setSelected: (selected: number[]) => void;

	multi?: boolean;
	enabled?: boolean;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default function SelectGroup(props: Props) {
	const oldChildren = useRef<ComponentChildren>(null);

	const [additive, setAdditive] = useState<boolean>(false);
	const [connect, setConnect] = useState<boolean>(false);

	const [lastSelected, setLastSelected] = useState<number | undefined>(undefined);
	const [context, setContext] = useState<SelectGroupContextData>(undefined as any as SelectGroupContextData);

	const { selected, multi, children, setSelected } = props;

	const handleSelect = useCallback(
		(n: number, state?: boolean) => {
			let newSelected = [...selected];

			if (!multi || !additive) {
				state = state ?? newSelected.indexOf(n) === -1;
				newSelected = state ? [n] : [];
			}

			if (multi && connect && lastSelected !== undefined) {
				const a = n < lastSelected ? n : lastSelected;
				const b = n < lastSelected ? lastSelected : n;
				for (let i = a; i <= b; i++) if (newSelected.indexOf(i) === -1) newSelected.push(i);
			} else if (multi && additive) {
				const currentState = newSelected.indexOf(n) !== -1;
				if ((state !== undefined && state !== currentState) || !state) {
					state = state ?? !currentState;

					if (state === false && newSelected.indexOf(n) !== -1) newSelected.splice(newSelected.indexOf(n), 1);
					else if (state === true && newSelected.indexOf(n) === -1) newSelected.push(n);
				}
			}

			setSelected(newSelected);
			setLastSelected(n);
		},
		[selected, multi, additive, connect, lastSelected, setSelected]
	);

	// Keyboard Callbacks

	useEffect(() => {
		const cbDown = (evt: KeyboardEvent) => {
			if (evt.key === 'Control') setAdditive(true);
			if (evt.key === 'Shift') setConnect(true);
		};
		const cbUp = (evt: KeyboardEvent) => {
			if (evt.key === 'Control') setAdditive(false);
			if (evt.key === 'Shift') setConnect(false);
		};

		window.addEventListener('keydown', cbDown);
		window.addEventListener('keyup', cbUp);

		return () => {
			window.removeEventListener('keydown', cbDown);
			window.removeEventListener('keyup', cbUp);
		};
	}, []);

	// Reset Array if children change.
	useEffect(() => {
		if (
			(Array.isArray(oldChildren.current) ? oldChildren.current.length : 1) !==
			(Array.isArray(children) ? children.length : 1)
		) {
			oldChildren.current = children;
			setSelected([]);
			setLastSelected(undefined);
		}
	}, [children, setSelected]);

	// Update context data
	useEffect(() => {
		setContext({ selected, onSelect: handleSelect });
	}, [handleSelect, selected]);

	return context ? (
		<SelectGroupContext.Provider value={context}>
			<ul role='list' class={props.class} style={props.style}>
				{children}
			</ul>
		</SelectGroupContext.Provider>
	) : null;
}
