import * as Preact from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

import './SelectGroup.sass';

export interface SelectGroupContextData {
	selected: number[];
	onSelect(ind: number, state?: boolean): void;
}

export const SelectGroupContext = Preact.createContext<SelectGroupContextData>({
	selected: [], onSelect: () => { /* No action for default context. */ }});

interface Props {
	selected: number[];
	setSelected: (selected: number[]) => void;

	multi?: boolean;
	enabled?: boolean;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default function SelectGroup(props: Props) {
	const oldChildren = useRef<Preact.ComponentChildren>(null);

	const [ additive, setAdditive ] = useState<boolean>(false);
	const [ connect, setConnect ] = useState<boolean>(false);

	const [ lastSelected, setLastSelected ] = useState<number | undefined>(undefined);
	const [ context, setContext ] = useState<SelectGroupContextData>(undefined as any as SelectGroupContextData);

	const handleSelect = useCallback((n: number, state?: boolean) => {
		let newSelected = [ ...props.selected ];

		if (!props.multi || !additive) {
			state = state ?? newSelected.indexOf(n) === -1;
			newSelected = state ? [ n ] : [ ];
		}

		if (props.multi && connect && lastSelected !== undefined) {
			let a = n < lastSelected ? n : lastSelected;
			let b = n < lastSelected ? lastSelected : n;
			for (let i = a; i <= b; i++) if (newSelected.indexOf(i) === -1) newSelected.push(i);
		}
		else if (props.multi && additive) {
			const currentState = newSelected.indexOf(n) !== -1;
			if ((state !== undefined && state !== currentState) || !state) {
				state = state ?? !currentState;

				if (state === false && newSelected.indexOf(n) !== -1) newSelected.splice(newSelected.indexOf(n), 1);
				else if (state === true && newSelected.indexOf(n) === -1) newSelected.push(n);
			}
		}

		props.setSelected(newSelected);
		setLastSelected(n);
	}, [ props.selected, props.multi, additive, connect, lastSelected ]);

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
		if ((Array.isArray(oldChildren.current) ? oldChildren.current.length : 1) !==
			(Array.isArray(props.children) ? props.children.length : 1)) {
			oldChildren.current = props.children;
			props.setSelected([]);
			setLastSelected(undefined);
		}
	}, [ props.children ]);

	// Update context data

	useEffect(() => {
		setContext({
			selected: props.selected,
			onSelect: handleSelect
		});
	}, [ handleSelect ]);

	return (
		context ? <SelectGroupContext.Provider value={context}>
			<ul class={('SelectGroup ' + (props.class ?? '')).trim()} style={props.style}>{props.children}</ul>
		</SelectGroupContext.Provider> : null
	);
}
