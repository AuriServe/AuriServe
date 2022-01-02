import path from 'path';
import { Page } from 'common';
import { ObjectId } from 'mongodb';
import { buildSchema } from 'graphql';
import { SCHEMA } from 'common/graph';
import * as Int from 'common/graph/type';
import fss, { promises as fs } from 'fs';

import Pages from './Pages';
import Media from './Media';
import Themes from './Themes';
import Plugins from './Plugins';

import * as Auth from './Auth';
import { Theme } from './Themes';
import { Plugin } from './Plugins';
import { IUser } from './model/User';
import { IMedia } from './model/Media';
import Properties from './model/Properties';
import RoleModel, { IRole } from './model/Role';

const DEFAULT_LAYOUT = fss.readFileSync(path.join(path.dirname(__dirname), 'views', 'layout.html')).toString();

export const Schema = buildSchema(SCHEMA);

export interface Context {
	pages: Pages;
	media: Media;
	themes: Themes;
	plugins: Plugins;
	dataPath: string;
}

type Resolved<T> = Record<keyof T, any>;

async function infoResolver(): Promise<Resolved<Int.Info>> {
	return (await Properties.findOne({}))!.info;
}

function quotasResolver(): Resolved<Int.Quotas> {
	return {
		storage: async () => {
			let usage = (await Properties.findOne({}))!.usage;
			return { used: usage.media_used, allocated: usage.media_allocated };
		}
	};
};

function userResolver(user: IUser): Resolved<Int.User> {
	return {
		id: user._id.toString(),
		username: user.username,
		emails: user.emails,
		roles: user.roles
	};
}

function themeResolver(theme: Theme, ctx: Context): Resolved<Int.Theme> {
	return {
		...theme,
		user: undefined,
		created: undefined,
		coverPath: theme.hasCover ? `/admin/themes/cover/${theme.identifier}.jpg` : '',
		head: async () => {
			if (!theme.sources.head) return '';
			return (await fs.readFile(path.join(ctx.dataPath, 'themes',
				theme.identifier, theme.sourceRoot ?? '.', theme.sources.head!))).toString();
		},
		layouts: () => [] // TODO
	};
}

function pluginResolver(plugin: Plugin): Resolved<Int.Plugin> {
	return {
		...plugin,
		user: undefined,
		created: undefined,
		name: plugin.name ?? plugin.identifier,
		description: plugin.description ?? '',
		coverPath: '/admin/plugins/cover/${plugin.identifier}.jpg'
	};
}

function mediaResolver(media: IMedia): Resolved<Int.Media> {
	return {
		...media.toObject(),
		path: media.fileName,
		user: media.uploader,
		id: media._id.toString(),
		created: media._id.getTimestamp(),
		url: `/media/${media.fileName}.${media.extension}`,
		size: () => {
			let size = media.size;
			if (!size || !size.width || !size.height) return null;
			return { x: size.width, y: size.height };
		}
	};
}

function roleResolver(role: IRole): Resolved<Int.Role> {
	return {
		...role.toObject(),
		users: undefined,
		lastModified: undefined,
		lastModifier: undefined,
		id: role._id.toString(),
		user: role.creator,
		created: role._id.getTimestamp()
	};
}

function pageResolver(page: Page.PageDocument, path: string): Resolved<Int.Page> {
	return {
		...page,
		path,
		name: page.name ?? '',
		layout: page.layout ?? 'default',
		description: page.description ?? '',
		content: () => JSON.stringify(page.elements)
	};
}

function includeResolver(include: Page.IncludeDocument, path: string): Resolved<Int.Include> {
	return {
		...include,
		path,
		content: () => JSON.stringify(include.element)
	};
}

export const Resolver = {
	info: async ({ info }: any) => {
		if (info) {
			let $set: any = {};
			for (let k of Object.keys(info)) $set['info.' + k] = info[k];
			await Properties.updateOne({}, { $set });
		}
		return infoResolver();
	},
	quotas: quotasResolver(),

	users:   ()                     => Auth.listUsers().then(users => users.map(userResolver)),
	themes:  (_: any, ctx: Context) => ctx.themes.listAll().map(theme => themeResolver(theme, ctx)),
	plugins: (_: any, ctx: Context) => ctx.plugins.listAll().map(pluginResolver),
	media:   (_: any, ctx: Context) => ctx.media.listMedia().then(media => media.map(mediaResolver)),
	roles:   ()                     => RoleModel.find({}).then((roles: IRole[]) => roles.map(roleResolver)),
	pages:   (_: any, ctx: Context) => ctx.pages.listPages(),

	user: async ({ id }: { id: string }) => {
		const u = await Auth.getUser(new ObjectId(id));
		return u ? userResolver(u) : undefined;
	},

	page: async ({ path, content }: { path: string; content?: string }, ctx: Context) => {
		if (!content) return ctx.pages.getPage(path).then(page => pageResolver(page, path));
		try {
			await ctx.pages.setPageContents(path, JSON.parse(content));
			return true;
		}
		catch (e) {
			return false;
		}
	},

	include: ({ path }: { path: string }, ctx: Context) => ctx.pages.getInclude(path)
		.then(include => includeResolver(include, path)),
	layout:  ({ name }: { name: string }, _ctx: Context) => ({ identifier: name, html: DEFAULT_LAYOUT }),

	theme: ({ identifier }: { identifier: string }, ctx: Context) => {
		const t = ctx.themes.get(identifier);
		return t ? themeResolver(t, ctx) : undefined;
	},
	plugin: ({ identifier }: { identifier: string }, ctx: Context) => {
		const p = ctx.plugins.get(identifier);
		return p ? pluginResolver(p) : undefined;
	},

	enabled_themes:  ({ enabled }: any, ctx: Context) => ctx.themes.setEnabled(enabled),
	enabled_plugins: ({ enabled }: any, ctx: Context) => ctx.plugins.setEnabled(enabled),
	delete_media:    ({ media   }: any, ctx: Context) => {
		try { Promise.all(media.map((id: ObjectId) => ctx.media.removeMedia(id))); return true; }
		catch (e) { return false; }
	}
};
