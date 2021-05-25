"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUTATE_PLUGINS = exports.MUTATE_THEMES = exports.MUTATE_DELETE_MEDIA = exports.MUTATE_INFO = exports.QUERY_ROLES = exports.QUERY_USERS = exports.QUERY_PLUGINS = exports.QUERY_THEMES = exports.QUERY_ALL_MEDIA = exports.QUERY_QUOTAS = exports.QUERY_INFO = exports.useMutation = exports.useQuery = exports.graphql = void 0;
const tslib_1 = require("tslib");
const graphql_react_1 = require("graphql-react");
const ENDPOINT = '/admin/graphql';
exports.graphql = new graphql_react_1.GraphQL();
const fetchOptionsOverride = (options) => options.url = ENDPOINT;
function useQuery(queries, options = {}, variables = {}) {
    var _a, _b, _c, _d;
    const query = '{' + (typeof queries === 'string' ? queries : queries.join('\n')) + '}';
    const res = graphql_react_1.useGraphQL(Object.assign(Object.assign({ loadOnMount: true, loadOnReload: true }, options), { operation: { query, variables }, fetchOptionsOverride }));
    if ((_a = res.cacheValue) === null || _a === void 0 ? void 0 : _a.graphQLErrors)
        console.error('Query Error:', (_b = res.cacheValue) === null || _b === void 0 ? void 0 : _b.graphQLErrors);
    return [((_d = (_c = res.cacheValue) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : {}), res.loading, res.load];
}
exports.useQuery = useQuery;
function useMutation(mutation) {
    return (variables) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const res = yield exports.graphql.operate({ operation: { query: mutation, variables },
            fetchOptionsOverride, reloadOnLoad: true }).cacheValuePromise;
        if (res.graphQLErrors)
            console.error('Mutation Error:', res.graphQLErrors);
    });
}
exports.useMutation = useMutation;
exports.QUERY_INFO = `
	info {
		domain
		favicon
		name
		description
	}
`;
exports.QUERY_QUOTAS = `
	quotas {
		storage {
			used
			allocated
		}
	}
`;
exports.QUERY_ALL_MEDIA = `
	media {
		id
		user
		created
		name
		description
		bytes
		extension
		path
		url
	}
`;
exports.QUERY_THEMES = `
	themes {
		identifier
		name
		author
		description
		coverPath
		enabled
	}
`;
exports.QUERY_PLUGINS = `
	plugins {
		identifier
		name
		author
		description
		coverPath
		enabled
	}
`;
exports.QUERY_USERS = `
	users {
		id
		username
		emails
	}
`;
exports.QUERY_ROLES = `
	roles {
		id
		name
		color { h, s, v }
		abilities
	}
`;
exports.MUTATE_INFO = `
	mutation UpdateInfo($info: InputInfo!) {
		info(info: $info) { domain }
	}
`;
exports.MUTATE_DELETE_MEDIA = `
	mutation DeleteMedia($media: [ID!]!) {
		delete_media(media: $media)
	}
`;
exports.MUTATE_THEMES = `
	mutation UpdateEnabledThemes($enabled: [String!]!) {
		enabled_themes(enabled: $enabled)
	}
`;
exports.MUTATE_PLUGINS = `
	mutation UpdateEnabledPlugins($enabled: [String!]!) {
		enabled_plugins(enabled: $enabled)
	}
`;
