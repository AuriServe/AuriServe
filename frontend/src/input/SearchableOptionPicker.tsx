import { h, VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Label from './InputLabel';
import { Card } from '../structure';

import { sign } from 'common';

interface Props {
	parent: HTMLElement;

	query: string;

	options: Record<string, any>[];
	fields: string | string[];

	children: (data: { option: Record<string, any>; ind: number; selected: boolean }) => VNode;

	onSelect: (value: Record<string, any>) => void;
}

function sort(query: string, a: string, b: string) {
	return (
		sign(a.indexOf(query) - b.indexOf(query)) || a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
	);
}

export default function SearchableOptionPicker(props: Props) {
	const [index, setIndex] = useState<number>(0);

	const query = props.query.toLowerCase().trim();
	const fields = Array.isArray(props.fields) ? props.fields : [props.fields];

	const filtered = props.options
		.filter((option) => {
			for (const field of fields) if ((option[field] as any)?.toLowerCase().includes(query)) return true;
			return false;
		})
		.sort((a, b) => {
			for (const fieldA of fields)
				for (const fieldB of fields)
					if ((a[fieldA] as any)?.toLowerCase().includes(query) && (b[fieldB] as any)?.toLowerCase().includes(query))
						return sort(query, a[fieldA] as any, b[fieldB] as any);
			return 0;
		})
		.slice(0, 5);

	useEffect(() => setIndex(0), [query]);

	// Interactions
	useEffect(() => {
		const handleArrowSelect = (evt: KeyboardEvent) => {
			if (evt.key !== 'ArrowUp' && evt.key !== 'ArrowDown' && evt.key !== 'Enter') return;

			evt.preventDefault();
			evt.stopPropagation();

			if (filtered.length === 0) return;
			if (evt.key === 'ArrowUp') setIndex((index) => (index <= 0 ? filtered.length : index) - 1);
			else if (evt.key === 'ArrowDown') setIndex((index) => (index + 1) % filtered.length);
			else if (evt.key === 'Enter') props.onSelect(filtered[index]);
		};

		window.addEventListener('keydown', handleArrowSelect);
		return () => window.removeEventListener('keydown', handleArrowSelect);
	});

	const style: any = {
		top: `${props.parent.getBoundingClientRect().bottom}px`,
		left: `${props.parent.getBoundingClientRect().left}px`,
		width: `${props.parent.getBoundingClientRect().width}px`,
	};

	return (
		<Card
			class='absolute z-10 overflow-auto !my-2 min-h-12 !p-0 max-h-96 pointer-events-auto rounded !shadow-lg'
			style={style}>
			{query && <Label class='px-2 bg-neutral-50 dark:bg-neutral-700' label={`Search results for '${query}'`} />}
			{filtered.length > 0 && (
				<ul>
					{filtered.map((option, ind) => (
						<li key={ind}>
							<button class='w-full focus:outline-none' onClick={() => props.onSelect(option)}>
								{props.children({ option, ind, selected: index === ind })}
							</button>
						</li>
					))}
				</ul>
			)}
			{filtered.length === 0 && (
				<div class='py-4 px-2 text-center'>
					<p class='text-neutral-400 pt-0.25 text-normal'>No results found.</p>
				</div>
			)}
		</Card>
	);
}
