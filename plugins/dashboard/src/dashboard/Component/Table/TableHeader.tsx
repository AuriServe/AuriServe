import { h } from 'preact';

import Svg from '../Svg';
import * as Icon from '../../Icon';

import { titleCase } from 'common';
import { merge, tw } from '../../Twind';
import { useTableContext } from './Table';
import { useClasses, Classes } from '../../Hooks';

interface Props {
	class?: Classes;
}

export default function TableHeader(props: Props) {
	const classes = useClasses(props.class);
	const { sortBy, sortReversed, page, columns } = useTableContext();

	function handleClickSort(sort: string) {
		if (sortBy() === sort) sortReversed(rev => !rev);
		else {
			sortBy(sort);
			sortReversed(columns().find(c => c.name === sort)?.sortReversed ?? false);
		}
		page(0);
	}

	return (
		<div
			class={merge(tw`grid w-full`, classes.get())}
			style={{ gridTemplateColumns: columns().filter(c => c.visible ?? true).map(col => col.size ?? '1fr').join(' ') }}
		>
			{columns().filter(c => c.visible ?? true).map((column) => {
				const active = sortBy() === column.name;
				return (
					<button
						key={column.name}
						class={tw`p-2 flex disabled:interact-none last:flex-row-reverse select-none`}
						onClick={() => handleClickSort(column.name)}
						disabled={!column.sortable}
					>
						<span class={tw`font-bold tracking-widest uppercase text-xs ${active ? 'text-gray-100' : 'text-gray-300'}`}>
							{column.label ?? titleCase(column.name)}
						</span>
						<Svg
							src={Icon.arrow_down}
							size={6}
							class={tw`shrink-0 -my-1 relative icon-p-gray-300 transition
								${sortReversed() ? 'scale-y-[-100%]' : '-translate-y-0.5'}
								${!active && 'opacity-0'}`}
						/>
					</button>
				);
			})}
		</div>
	);
}
