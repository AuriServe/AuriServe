import { VNode, h } from 'preact';

import { Column, DataContext, RowType, useTableContext } from './Table';
import { Classes, useClasses } from '../../Hooks';
import { merge, tw } from '../../Twind';

interface RowContext<T extends RowType> {
	data: T;
	ind: number;
	dataInd: number;
	columns: readonly Column[];
}

interface Props<T extends RowType> {

	/**
	 * A function which renders a row of the table. Will be called for every visible row.
	 */

	children: (ctx: RowContext<T>) => VNode;

	class?: Classes;
}

export default function TableBody<T extends RowType>(props: Props<T>) {
	const { data, page, itemsPerPage, columns, idKey } = useTableContext();
	const classes = useClasses(props.class);

	return (
		<ol class={classes.get()}>
			{data().slice(page() * itemsPerPage(), (page() + 1) * itemsPerPage()).map((elem, ind) =>
				<li
					key={elem[idKey]}
					value={page() * itemsPerPage() + ind}
					class={merge(tw``, classes.get('row'))}>
					{props.children({
						data: elem as T,
						ind,
						dataInd: page() * itemsPerPage() + ind,
						columns: columns()
					})}
				</li>
			)}
		</ol>
	);
}
