// import Cookie from 'js-cookie';
import { GraphQL, useGraphQL } from 'graphql-react';

/** The GQL endpoint to query. */
const ENDPOINT = '/admin/graphql';

/** The main GQL instance. */
export const graphql = new GraphQL();

/** Used in graphql-react to target the right endpoint. */
const fetchOptionsOverride = (options: any) => options.url = ENDPOINT;

import { Query } from 'common/graph';
import * as Int from 'common/graph/type';


/** Specifies various options for useQuery. */
interface Options {
	loadOnMount?: boolean;
	loadOnReload?: boolean;
	loadOnReset?: boolean;
	reloadOnLoad?: boolean;
	resetOnLoad?: boolean;
}


/**
 * A result provided by the useQuery hook.
 * It is an array containing (in the following order):
 * - The currently cached query data,
 * - A boolean indicating load state,
 * - and a function that can be called to refresh the cache.
 */

type UseQueryResult = [ Partial<Int.Root>, boolean, () => void ];


/**
 * A hook that provides access to making cached GraphQL queries.
 * Accepts a query string or an array of query strings, which will be
 * appended together and wrapped in a single outer pair of curly brackets.
 * It is recommended to use the constant queries defined below this function.
 *
 * Returns an array containing (in the following order):
 * - The currently cached query data,
 * - A boolean indicating load state,
 * - and a function that can be called to refresh the cache.
 *
 * @param {string | string[]} queries - A string or set of strings representing GraphQL queries to operate on the server.
 * @param {Options} options - An optional set of options to alter the caching behavior of the queries.
 * @param {Object} variables - An optional set of variables to send with the query.
 * @returns an array containing the hook's result.
 */

export function useQuery(queries: string | string[], options: Options = {}, variables: any = {}): UseQueryResult {
	const query = '{' + (typeof queries === 'string' ? queries : queries.join('\n')) + '}';
	const res = useGraphQL({ loadOnMount: true, loadOnReload: true,
		...options, operation: { query, variables }, fetchOptionsOverride });

	if (res.cacheValue?.graphQLErrors) console.error('Query Error:', res.cacheValue?.graphQLErrors);
	return [ (res.cacheValue?.data ?? {}) as Partial<Int.Root>, res.loading, res.load ];
}


/**
 * A hook that returns a function to execute the provided GQL query with dynamic variables,
 * which is useful for mutations. Triggers a refresh when the query completes.
 * It is recommended to use the constant queries defined below this function.
 *
 * @param {string} mutation - A GraphQL query to operate on the server.
 * @returns an function that will execute the specified query with the provided variables.
 */

export function useMutation(mutation: string) {
	return async (variables: any) => {
		const res = await graphql.operate({ operation: { query: mutation, variables },
			fetchOptionsOverride, reloadOnLoad: true }).cacheValuePromise;

		if (res.graphQLErrors) console.error('Mutation Error:', res.graphQLErrors);
	};
}


/** Queries basic site info. */
export const QUERY_INFO = `info ${Query.Info}`;

/** Queries site quotas. */
export const QUERY_QUOTAS = `quotas ${Query.Quotas}`;

/** Queries all media elements. */
export const QUERY_MEDIA = `media ${Query.Media}`;

/** Queries all themes. */
export const QUERY_THEMES = `themes ${Query.Theme}`;

/** Queries all themes. */
export const QUERY_PLUGINS = `plugins ${Query.Plugin}`;

/** Queries all media elements. */
export const QUERY_USERS = `users ${Query.User}`;

/** Queries all roles. */
export const QUERY_ROLES = `roles ${Query.Role}`;


/** Mutates basic site info. */
export const MUTATE_INFO = `
	mutation UpdateInfo($info: InputInfo!) {
		info(info: $info) { domain }
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
