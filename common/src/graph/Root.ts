import * as Type from './type';

export interface Interface {
	info: Type.Info,
	quotas: Type.Quotas,

	users: Type.User[],
	themes: Type.Theme[],
	plugins: Type.Plugin[],
	media: Type.Media[],
	roles: Type.Role[],
	pages: Type.Page[],

	page?: Type.Page,
	layout?: Type.Layout,
	include?: Type.Include
}

export const Schema = `
	type Query {
		info: Info!
		quotas: Quotas!

		users: [User!]!
		themes: [Theme!]!
		plugins: [Plugin!]!
		media: [Media!]!
		roles: [Role!]!
		pages: [Page!]!

		user(id: String): User

		page(path: String): Page
		layout(name: String): Layout
		include(path: String): Include
		
		theme(identifier: String): Theme
		plugin(identifier: String): Plugin
	}

	type Mutation {
		info(info: InputInfo): Info!
		delete_media(media: [ID!]!): Boolean
		enabled_themes(enabled: [String!]!): Boolean
		enabled_plugins(enabled: [String!]!): Boolean
		page(path: String!, content: String!): Boolean
	}
`;
