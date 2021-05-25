import * as Preact from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';

import { Format } from 'as_common';

import './SearchableOptionPicker.sass';

import Label from './InputLabel';


interface SearchProps {
	parent: HTMLElement;
	query: string;
	multi?: boolean;

	options: string[] | {[key: string]: string };
	renderOption?: Preact.FunctionalComponent<{ option: string; ind: number; value?: any }>;

	setSelected: (identifier: string | string[]) => any;
}

function sortOptions(query: string, a: string, b: string) {
	let off = a.indexOf(query) - b.indexOf(query);
	if (off < 0) return -1;
	if (off > 0) return 1;
	return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export default function SearchableOptionPicker(props: SearchProps) {
	const [ index, setIndex ] = useState<number>(0);

	const optionsArray = useMemo(() => Array.isArray(props.options) ?
		props.options : Object.keys(props.options), [ props.options ]);

	const query = props.query.toLowerCase().trim();
	const filteredOptions = optionsArray.filter(o => o.toLowerCase().includes(query))
		.sort((a, b) => sortOptions(query, a, b)).filter((_, i) => i < 5);

	useEffect(() => setIndex(0), [ query ]);

	// Interactions

	useEffect(() => {
		const handleArrowSelect = (evt: KeyboardEvent) => {
			if (evt.key !== 'ArrowUp' && evt.key !== 'ArrowDown' && evt.key !== 'Enter') return;
			
			evt.preventDefault();
			evt.stopPropagation();

			if (filteredOptions.length === 0) return;
			if (evt.key === 'ArrowUp') setIndex((index) => (index <= 0 ? filteredOptions.length : index) - 1);
			else if (evt.key === 'ArrowDown') setIndex((index) => (index + 1) % filteredOptions.length);
			else if (evt.key === 'Enter') props.setSelected(filteredOptions[index]);
		};

		window.addEventListener('keydown', handleArrowSelect);
		return () => window.removeEventListener('keydown', handleArrowSelect);
	});

	const style: any = {
		top: props.parent.getBoundingClientRect().bottom + 'px',
		left: (props.parent.getBoundingClientRect().left +
			props.parent.getBoundingClientRect().width / 2) + 'px',
		width: props.parent.getBoundingClientRect().width + 'px'
	};

	return (
		<div class='SearchableOptionPicker' style={style} onMouseDown={evt => { evt.preventDefault(); evt.stopPropagation(); }}>
			{query && <Label label={`Search results for '${query}'`} />}
			<ul class='SearchableOptionPicker-Items'>
				{filteredOptions.map((option, ind) => <li
					class={('SearchableOptionPicker-Item ' + (index === ind ? 'Focused' : '')).trim()}
					key={ind} onClick={() => props.setSelected(option)}>
					<button class='SearchableOptionPicker-Button'>
						{props.renderOption ? props.renderOption({ option, ind,
							value: !Array.isArray(props.options) && props.options[option] }) :
							<span class='SearchableOptionPicker-DefaultItem'>
								{Array.isArray(props.options) ? option : props.options[option] || Format.fileNameToName(option)}
							</span>
						}
					</button>
				</li>)}
				{filteredOptions.length === 0 &&
					<div class='SearchableOptionPicker-Empty'>
						<p>No results found.</p>
					</div>
				}
			</ul>
		</div>
	);
}
