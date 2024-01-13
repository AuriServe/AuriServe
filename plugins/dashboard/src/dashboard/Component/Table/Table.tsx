import { merge } from 'common';
import { forwardRef } from 'preact/compat';
import { ComponentChildren, VNode, createContext, h } from 'preact';
import { useAsyncEffect, useStore, Store } from 'vibin-hooks';
import { useContext, useLayoutEffect, useMemo } from 'preact/hooks';

import { tw } from '../../Twind';
import { useClasses, Classes } from '../../Hooks';

import TableBody from './TableBody';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';

export type RowType = Record<string, any>;

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

	/** The key in the data to use as a unique ID. */
	idKey?: keyof T;

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

	class?: Classes;

	children: ComponentChildren;
}

export interface TableContextData<T extends RowType> {
	data: Store<T[]>;

	filter: Store<string>;
	sortBy: Store<string>;
	sortReversed: Store<boolean>;
	page: Store<number>;
	columns: Store<Column[]>;
	itemsPerPage: Store<number>;
	idKey: string;
}

const TableContext = createContext<TableContextData<any>>({} as any);

export function useTableContext<T extends RowType>() {
	return useContext(TableContext) as TableContextData<T>;
}

function processArrayData<T extends RowType>(
	data: T[], ctx: DataContext, sort: MaybeSort<T> | undefined, filter: MaybeFilter<T>): T[] {
	if (ctx.filter !== '' && typeof filter === 'function') data = filter(data, ctx);
	if (sort !== false) data = (typeof sort === 'function' ? sort : DEFAULT_SORT_FN)(data, ctx);
	if (sort !== false && ctx.sortReversed) data.reverse();
	return data;
}

const TableRaw = forwardRef<HTMLElement, Props<RowType>>(function Table(props, ref) {
	const classes = useClasses(props.class);

	const columns = useStore([ ...props.columns ]);
	const sortBy = useStore<string>(props.sortBy ?? props.columns[0].name);
	const sortReversed = useStore(
		props.sortReversed ?? props.columns.find(c => c.name === sortBy())?.sortReversed ?? false);
	const filter = useStore('');
	const page = useStore(0);
	const itemsPerPage = useStore(props.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE);

	if (!Array.isArray(props.data) && typeof props.sort === 'function')
		throw new Error('`sort` must be a boolean when `data` is a function.');
	if (!Array.isArray(props.data) && typeof props.filter === 'function')
		throw new Error('`filter` must be a boolean when `data` is a function.');

	const dataContext = useMemo<DataContext>(() => ({
		filter: filter(),
		itemsPerPage: itemsPerPage(),
		page: page(),
		sortBy: sortBy(),
		sortReversed: sortReversed()
	}), [ page(), filter(), sortBy(), sortReversed(), itemsPerPage() ]);

	const data = useStore<RowType[]>(Array.isArray(props.data)
		? processArrayData(props.data, dataContext, props.sort, props.filter ?? false)
		: []);

	const tableContext = useMemo<TableContextData<RowType>>(() => ({
		data,
		filter,
		itemsPerPage,
		page,
		sortBy,
		sortReversed,
		columns,
		idKey: props.idKey ?? 'id'
	}), [ data(), filter(), itemsPerPage(), page(), sortBy(), sortReversed(), columns(), props.idKey ]);

	/** When the sort, filters, or data function changes, reset the page data. */
	useLayoutEffect(() => {
		if (Array.isArray(props.data))
			data(processArrayData(props.data, dataContext, props.sort ?? DEFAULT_SORT_FN, props.filter ?? false));
		else
			data([]);
	}, [ sortBy, sortReversed, filter, dataContext, props.data, props.sort, props.filter ])

	/** When the sort, filters, page, or data function changes, get new data. */
	useAsyncEffect(async (abort) => {
		if (Array.isArray(props.data)) return;
		try {
			const newData = await props.data(
				Math.max((page() - 1) * dataContext.itemsPerPage, 0),
				(page() + 1) * dataContext.itemsPerPage,
				dataContext,
				abort
			);
			if (abort.aborted) return;
			data(newData);
		}
		catch (e) {
			console.error('Failed to fetch data for table:', e);
		}
	}, [ page(), props.data, dataContext ])

	return (
		<TableContext.Provider value={tableContext}>
			<div class={merge(tw`flex flex-col`, classes.get())}>
				{props.children}
			</div>
		</TableContext.Provider>
	);
});

const Table: (<T extends RowType>(props: Props<T>) => VNode) & {
	Body: typeof TableBody;
	Header: typeof TableHeader;
	Footer: typeof TableFooter;
} = TableRaw as any;

Table.Body = TableBody;
Table.Header = TableHeader;
Table.Footer = TableFooter;

export default Table;
