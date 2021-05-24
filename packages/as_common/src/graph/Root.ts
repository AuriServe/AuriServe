import * as Int from './Interface';

export interface Interface {
	info: Int.Info,
	quotas: Int.Quotas,

	users: Int.User[],
	themes: Int.Theme[],
	plugins: Int.Plugin[],
	media: Int.Media[],
	roles: Int.Role[],
	pages: Int.Page[]
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
		theme(identifier: String): Theme
		plugin(identifier: String): Plugin
	}

	type Mutation {
		info(info: InputInfo): Info!
		delete_media(media: [ID!]!): Boolean
		enabled_themes(enabled: [String!]!): Boolean,
		enabled_plugins(enabled: [String!]!): Boolean,
	}
`;
