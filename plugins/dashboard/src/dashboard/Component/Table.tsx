import { VNode, h } from 'preact';
import { useAsyncEffect } from 'vibin-hooks';
import { useLayoutEffect, useMemo, useState } from 'preact/hooks';

import { tw } from '../Twind';
import { Icon, Svg } from '../Main';
import { merge, titleCase } from 'common';

export type RowType = { id: any } & Record<string, any>;

export type Column = {
	name: string;
	label?: string;
	size?: `${number}px` | `${number}fr`,
	visible?: boolean;
	sortable?: boolean;
	sortReversed?: boolean;
}

export interface DataContext {
	filter: string;
	sortBy: string;
	sortReversed: boolean;
	page: number;
	itemsPerPage: number;
}

export type FilterFn<T extends RowType> = ((data: T[], ctx: DataContext) => T[]);
export type MaybeFilter<T extends RowType> = FilterFn<T> | boolean;

export type SortFn<T extends RowType> = ((data: T[], ctx: DataContext) => T[]);
export type MaybeSort<T extends RowType> = SortFn<T> | boolean;

export type DataFn<T extends RowType> =
	((from: number, to: number, ctx: DataContext, abort: AbortSignal) => (Promise<T[]> | T[]));

const DEFAULT_ITEMS_PER_PAGE = 16;

function DEFAULT_SORT_FN<T extends RowType>(data: T[], ctx: DataContext): T[] {
	return [ ...data ].sort((a, b) => {
		const aVal = a[ctx.sortBy];
		const bVal = b[ctx.sortBy];
		if (aVal < bVal) return -1;
		if (aVal > bVal) return 1;
		return 0;
	});
};

interface Props<T extends RowType> {
	/** Specifications for the columns in this table. */
	columns: Column[];

	/** The default column to sort by. Defaults to the first column. */
	sortBy?: string;

	/** Whether the default sort direction should be reversed or not. */
	sortReversed?: boolean;

	/** The number of items per page, defualts to DEFAULT_ITEMS_PER_PAGE. */
	itemsPerPage?: number;

	/**
	 * The data for the page, which is either an array of data or a function that retrieves an array of data.
	 * If a function is specified, it will be called every time the sort, sort direction, filters, or page changes.
	 * The function may be asynchronous, however it should listen for the abort signal to avoid unnecessary computations.
	 */

	data: T[] | DataFn<T>;

	/**
	 * A function to handle sorting the data, or a boolean indicating that this sorting will be done
	 * by the data function. If `data` is an array, this function will be called on sorting changes, falling back to
	 * DEFAULT_SORT_FUNC if unspecified. If `false`, no sorting will ever be done. If `props.data` is a function,
	 * `sort` must be a boolean indicating if sorting is allowed. In this case, sorting must be done by `data`.
	 */

	sort?: MaybeSort<T>;

	/**
	 * A function to handle filtering the data, or a boolean indicating that this filtering work will be done
	 * by the data function. If `data` is an array, this function MUST be specified for filtering to be enabled.
	 * If `props.data` is a function, `filter` must be a boolean indicating if filtering is allowed. In this case,
	 * filtering must be done by the `data` function.
	 */

	filter?: MaybeFilter<T>;

	/**
	 * A function to render a row of the table. Will be called for every visible row.
	 */

	children: (elem: T, ctx: DataContext & { ind: number, data: T[], columns: Column[] }) => VNode;

	class?: string;

	headerClass?: string;

	bodyClass?: string;

	rowClass?: string;

	footerClass?: string;
}

function processArrayData<T extends RowType>(
	data: T[], ctx: DataContext, sort: MaybeSort<T> | undefined, filter: MaybeFilter<T>): T[] {
	if (ctx.filter !== '' && typeof filter === 'function') data = filter(data, ctx);
	if (sort !== false) data = (typeof sort === 'function' ? sort : DEFAULT_SORT_FN)(data, ctx);
	if (sort !== false && ctx.sortReversed) data.reverse();
	return data;
}

export default function Table<T extends RowType>(props: Props<T>) {
	const [ columns, setColumns ] = useState([ ...props.columns ]);
	const [ sortBy, setSortBy ] = useState<string>(props.sortBy ?? props.columns[0].name);
	const [ sortReversed, setSortReversed ] = useState(
		props.sortReversed ?? props.columns.find(c => c.name === sortBy)?.sortReversed ?? false);
	const [ filter, setFilter ] = useState('');
	const [ page, setPage ] = useState(0);

	if (!Array.isArray(props.data) && typeof props.sort === 'function')
		throw new Error('`sort` must be a boolean when `data` is a function.');
	if (!Array.isArray(props.data) && typeof props.filter === 'function')
		throw new Error('`filter` must be a boolean when `data` is a function.');

	const dataContext = useMemo<DataContext>(() => ({
		filter,
		itemsPerPage: props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE,
		page,
		sortBy,
		sortReversed
	}), [ filter, props.itemsPerPage, page, sortBy, sortReversed ]);

	const [ data, setData ] = useState<T[]>(Array.isArray(props.data)
		? processArrayData(props.data, dataContext, props.sort, props.filter ?? false)
		: []);

	/** When the sort, filters, or data function changes, reset the page data. */
	useLayoutEffect(() => {
		if (Array.isArray(props.data))
			setData(processArrayData(props.data, dataContext, props.sort ?? DEFAULT_SORT_FN, props.filter ?? false));
		else
			setData([]);
	}, [ sortBy, sortReversed, filter, dataContext, props.data, props.sort, props.filter ])

	/** When the sort, filters, page, or data function changes, get new data. */
	useAsyncEffect(async (abort) => {
		if (Array.isArray(props.data)) return;
		try {
			const data = await props.data(
				Math.max((page - 1) * dataContext.itemsPerPage, 0),
				(page + 1) * dataContext.itemsPerPage,
				dataContext,
				abort
			);
			if (abort.aborted) return;
			setData(data);
		}
		catch (e) {
			console.error('Failed to fetch data for table:', e);
		}
	}, [ page, props.data, dataContext ])

	function handleClickSort(sort: string) {
		setSortBy(existing => {
			if (sort === existing) setSortReversed(rev => !rev);
			else setSortReversed(columns.find(c => c.name === sort)?.sortReversed ?? false);
			return sort;
		});
		setPage(0);
	}

	return (
		<div class={props.class}>
			<div
				class={merge(tw`grid w-full`, props.headerClass)}
				style={{ gridTemplateColumns: columns.filter(c => c.visible ?? true).map(col => col.size ?? '1fr').join(' ') }}
			>
				{columns.filter(c => c.visible ?? true).map((column) => {
					const active = sortBy === column.name;
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
									${sortReversed ? 'scale-y-[-100%]' : '-translate-y-0.5'}
									${!active && 'opacity-0'}`}
							/>
						</button>
					);
				})}
			</div>
			<ol class={props.bodyClass}>
				{data.slice(page * dataContext.itemsPerPage, (page + 1) * dataContext.itemsPerPage).map((elem, ind) =>
					<li
						key={elem.id}
						value={page * dataContext.itemsPerPage + ind}
						class={merge(tw``, props.rowClass)}>
						{props.children(elem, { ...dataContext, ind, data, columns })}
					</li>
				)}
			</ol>
			<div class={merge(tw``, props.footerClass)}>
				<p>Test</p>
			</div>
		</div>

	)
}
