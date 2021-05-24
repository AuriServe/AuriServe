import { ObjectID } from 'mongodb';

import Context from '../Context';
import * as Auth from '../../data/Auth';
import Properties from '../../data/model/Properties';
import RoleModel, { IRole } from '../../data/model/Role';

import { Resolver as Info } from './Info';
import { Resolver as User } from './User';
import { Resolver as Role } from './Role';
// import { Resolver as Page } from './Page';
import { Resolver as Media } from './Media';
import { Resolver as Theme } from './Theme';
import { Resolver as Quotas } from './Quotas';
import { Resolver as Plugin } from './Plugin';

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

export const Resolver = {
	info: async ({ info }: any) => {
		if (info) {
			let $set: any = {};
			for (let k of Object.keys(info)) $set['info.' + k] = info[k];
			await Properties.updateOne({}, { $set });
		}
		return Info;
	},
	quotas: Quotas,

	users: async () => (await Auth.listUsers()).map(u => User(u)),
	themes: (_: any, ctx: Context) => ctx.themes.listAll().map(t => new Theme(t)),
	plugins: (_: any, ctx: Context) => ctx.plugins.listAll().map(p => new Plugin(p)),
	media: async (_: any, ctx: Context) => (await ctx.media.listMedia()).map(m => new Media(m)),
	roles: async () => (await RoleModel.find({})).map((r: IRole) => new Role(r)),

	user: async ({ id }: { id: string }) => {
		const u = await Auth.getUser(new ObjectID(id));
		return u ? User(u) : undefined;
	},
	theme: ({ identifier }: { identifier: string }, ctx: Context) => {
		const t = ctx.themes.get(identifier);
		return t ? new Theme(t) : undefined;
	},
	plugin: ({ identifier }: { identifier: string }, ctx: Context) => {
		const p = ctx.plugins.get(identifier);
		return p ? new Plugin(p) : undefined;
	},

	enabled_themes: ({ enabled }: any, ctx: Context) => ctx.themes.setEnabled(enabled),
	enabled_plugins: ({ enabled }: any, ctx: Context) => ctx.plugins.setEnabled(enabled),
	delete_media: ({ media }: any, ctx: Context) => {
		try { Promise.all(media.map((id: ObjectID) => ctx.media.removeMedia(id))); return true; }
		catch (e) { return false; }
	}
};
