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

type UseDataResult = [
	Partial<{
		user: {
			name: string;
			identifier: string;
			roles: string[];
			permissions: string[];
		};
		info: {
			name: string;
			domain: string;
			description: string;
			favicon: string;
		};
		permissions: {
			identifier: string;
			name: string;
			description: string;
			category: string;
			default: boolean;
		}[];
		permissionCategories: {
			identifier: string;
			name: string;
			description: string;
			icon: string;
			priority: number;
		}[];
		roles: {
			identifier: string;
			name: string;
			permissions: string[];
		}[];
		users: {
			identifier: string;
			name: string;
			emails: string[];
			roles: string[];
		}[];
	}>,
	() => void
];

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
		if (!queries.length) return;
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
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'token': localStorage.getItem('token'),
		} as any,
		cache: 'no-cache',
		body: JSON.stringify({ query, variables }),
	}).then((res) => res.json())) as { data?: T; graphQLErrors?: string[] };

	if (res.graphQLErrors) console.error('GraphQL Error:', res.graphQLErrors);
	return res.data ?? ({} as T);
}

/** Queries basic site info. */
export const QUERY_INFO = `info { name, description, domain }`;

/** Queries all permissions. */
export const QUERY_PERMISSIONS = `permissions { identifier, name, description, category, default }`;

/** Queries all permissions categories. */
export const QUERY_PERMISSION_CATEGORIES = `permissionCategories { identifier, name, description, icon, priority }`;

/** Queries the current user. */
export const QUERY_SELF_USER = `user { identifier, name, emails, roles, permissions }`;

/** Queries all users. */
export const QUERY_USERS = `users { identifier, name, emails, roles }`;

/** Queries all roles. */
export const QUERY_ROLES = `roles { identifier, name, permissions }`;

/** Queries site quotas. */
// export const QUERY_QUOTAS = `quotas ${Query.Quotas}`;

/** Queries developer settings. */
// export const QUERY_DEVELOPER = `developer ${Query.Developer}`;

/** Queries all media elements. */
// export const QUERY_MEDIA = `media ${Query.Media}`;

// /** Queries all plugins. */
// export const QUERY_PLUGINS = `plugins ${Query.Plugin}`;

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

/** Gets a password reset token. */
// TODO: This should be a mutation but the GraphQL api doesn't support mutations.
export const MUTATE_CREATE_PASSWORD_RESET_TOKEN = `
	query CreatePasswordResetToken($identifier: String!) {
		createPasswordResetToken(identifier: $identifier)
	}
`;