import { useEffect, useContext } from 'preact/hooks';

import { AppContext, AppContextData } from './Component/App';

// import { Query } from 'common/graph';
// import * as Int from 'common/graph/type';

/** The GQL endpoint to query. */
const ENDPOINT = '/dashboard/res/gql';

/**
 * A result provided by the useData hook.
 * It is an array containing (in the following order):
 * - The global data cache
 * - and a function that can be called to refresh the cache.
 */

type UseDataResult = [Partial<any>, () => void];

/**
 * A hook that provides access to the cached App data, and can refresh subsets of data if supplied with queries.
 * Accepts a query string or an array of query strings, which will be
 * appended together and wrapped in a single outer pair of curly brackets.
 * It is recommended to use the constant queries defined below this function.
 *
 * Returns an array containing (in the following order):
 * - The currently cached query data,
 * - and a function that can be called to re-execute the passed-in queries.
 *
 * @param {string | string[]} queries - A string or set of strings representing GraphQL queries to operate.
 * @param {Options} dependents - An optional set of varibles that will trigger the query to re-execute.
 * @returns an array containing the hook's result.
 */

export function useData(queries: string | string[], dependents?: any[]): UseDataResult {
	const query = `{${typeof queries === 'string' ? queries : queries.join('\n')}}`;

	const { data, mergeData } = useContext<AppContextData>(AppContext);

	const refreshData = async (abort?: AbortSignal) => {
		const data = await executeQuery(query);
		if (!abort?.aborted) mergeData(data);
	};

	useEffect(() => {
		const controller = new AbortController();
		refreshData(controller.signal);
		return () => controller.abort();
	}, dependents); // eslint-disable-line react-hooks/exhaustive-deps

	return [data, (abort?: AbortSignal) => refreshData(abort)];
}

/**
 * A result provided by the useQuery hook.
 * It is an array containing (in the following order):
 * - The currently cached query data,
 * - A boolean indicating load state,
 * - and a function that can be called to refresh the cache.
 */

// type UseQueryResult = [Partial<Int.Root>, boolean, () => void];

// /**
//  * A hook that provides access to making cached GraphQL queries.
//  * Accepts a query string which will be interpreted *as is*.
//  * It is recommended to use the constant queries defined below this function.
//  *
//  * Returns an array containing (in the following order):
//  * - The currently cached query data,
//  * - A boolean indicating load state,
//  * - and a function that can be called to refresh the cache.
//  *
//  * @param {string} queries - A GraphQL query to operate on the server.
//  * @param {Options} options - An optional set of options to alter the caching behavior of the queries.
//  * @param {Object} variables - An optional set of variables to send with the query.
//  * @returns an array containing the hook's result.
//  */

// export function useQuery(query: string, variables: any = {}): UseQueryResult {
// 	// const dataRef = useRef<Partial<Int.Root>>({});
// 	// const fetchRef = useRef<AbortController>(new AbortController());

// 	// useEffect(() => {

// 	// }, [])

// 	// const res = useGraphQL({
// 	// 	loadOnMount: true,
// 	// 	loadOnReload: true,
// 	// 	...options,
// 	// 	operation: { query, variables },
// 	// 	fetchOptionsOverride,
// 	// });

// 	// if (res.cacheValue?.graphQLErrors)
// 	// 	console.error('Query Error:', res.cacheValue?.graphQLErrors);
// 	// return [(res.cacheValue?.data ?? {}) as Partial<Int.Root>, res.loading, res.load];

// 	return [
// 		{},
// 		false,
// 		() => {
// 			/* TODO */
// 		},
// 	];
// }

/**
 * A function that executes a query.
 *
 * @param {string} query - A GraphQL query to operate on the server.
 * @param {Object} variables - An optional set of variables to send with the query.
 * @returns a promise to the result.
 */

export async function executeQuery<T = any>(
	query: string,
	variables: any = {}
): Promise<T> {
	const res = (await fetch(ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		cache: 'no-cache',
		body: JSON.stringify({ query, variables }),
	}).then((res) => res.json())) as { data?: T; graphQLErrors?: string[] };

	if (res.graphQLErrors) console.error('GraphQL Error:', res.graphQLErrors);
	return res.data ?? ({} as T);
}

// /**
//  * A hook that returns a function to execute the provided GQL query with dynamic variables,
//  * which is useful for mutations. Triggers a refresh when the query completes.
//  * It is recommended to use the constant queries defined below this function.
//  *
//  * @param {string} mutation - A GraphQL query to operate on the server.
//  * @returns an function that will execute the specified query with the provided variables.
//  */

// export function useMutation(mutation: string) {
// 	return async (variables: any) => {
// 		return await executeQuery(mutation, variables);;
// 	};
// }

/** Queries basic site info. */
export const QUERY_INFO = `info { name, description, domain }`;

/** Queries site quotas. */
// export const QUERY_QUOTAS = `quotas ${Query.Quotas}`;

/** Queries developer settings. */
// export const QUERY_DEVELOPER = `developer ${Query.Developer}`;

/** Queries all media elements. */
// export const QUERY_MEDIA = `media ${Query.Media}`;

// /** Queries all themes. */
// export const QUERY_THEMES = `themes ${Query.Theme}`;

// /** Queries all plugins. */
// export const QUERY_PLUGINS = `plugins ${Query.Plugin}`;

// /** Queries all media elements. */
// export const QUERY_USERS = `users ${Query.User}`;

// /** Queries all roles. */
// export const QUERY_ROLES = `roles ${Query.Role}`;

// /** Queries all pages. */
// export const QUERY_PAGES = `pages ${Query.PageMeta}`;

/** Queries a page. */
// export const QUERY_PAGE = `
// 	query GetPage($path: String!) {
// 		page(path: $path) ${Query.Page}
// 	}
// `;

// /** Queries a page. */
// export const QUERY_INCLUDE = `
// 	query GetInclude($path: String!) {
// 		include(path: $path) ${Query.Include}
// 	}
// `;

// /** Queries a layout. */
// export const QUERY_LAYOUT = `
// 	query GetLayout($name: String!) {
// 		layout(name: $name) ${Query.Layout}
// 	}
// `;

/** Mutates basic site info. */
export const MUTATE_INFO = `
	mutation UpdateInfo($info: InputInfo!) {
		info(info: $info) { domain }
	}
`;

/** Mutates developer settings. */
export const MUTATE_DEVELOPER = `
	mutation UpdateDeveloper($info: InputDeveloper!) {
		developer(developer: $developer)
	}
`;

/** Mutation that deletes specified media items. */
export const MUTATE_DELETE_MEDIA = `
	mutation DeleteMedia($media: [ID!]!) {
		delete_media(media: $media)
	}
`;

/** Mutates enabled themes. */
export const MUTATE_THEMES = `
	mutation UpdateEnabledThemes($enabled: [String!]!) {
		enabled_themes(enabled: $enabled)
	}
`;

/** Mutates enabled plugins. */
export const MUTATE_PLUGINS = `
	mutation UpdateEnabledPlugins($enabled: [String!]!) {
		enabled_plugins(enabled: $enabled)
	}
`;

/** Mutates a page. */
export const MUTATE_PAGE = `
	mutation UpdatePage($path: String!, $content: String!) {
		page(path: $path, content: $content)
	}
`;
