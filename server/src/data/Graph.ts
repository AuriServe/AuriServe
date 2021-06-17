import fss from 'fs';
import path from 'path';
import { Page } from 'common';
import { ObjectID } from 'mongodb';
import { buildSchema } from 'graphql';
import { SCHEMA } from 'common/graph';

import Pages from './Pages';
import Media from './Media';
import Themes from './Themes';
import Plugins from './Plugins';

import * as Auth from './Auth';
import Theme from './theme/Theme';
import Plugin from './plugin/Plugin';
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
}

const InfoResolver = {
	name:			 	 async () => (await Properties.findOne({}))!.info.name,
	domain:			 async () => (await Properties.findOne({}))!.info.domain,
	favicon:		 async () => (await Properties.findOne({}))!.info.favicon,
	description: async () => (await Properties.findOne({}))!.info.description
};
 
const QuotasResolver = {
	storage: async () => {
		let usage = (await Properties.findOne({}))!.usage;
		return { used: usage.media_used, allocated: usage.media_allocated };
	}
};

function UserResolver(user: IUser) {
	return {
		id: user._id.toString(),
		username: user.username,
		emails: user.emails,
		roles: user.roles
	};
}

const LayoutResolver = (identifier: string, html: string) => ({ identifier, html });

class ThemeResolver {
	constructor(private theme: Theme) {}

	// TODO: id, user, created

	enabled = () => this.theme.isEnabled();

	name 				= () => this.theme.config.name;
	identifier  = () => this.theme.config.identifier;
	description = () => this.theme.config.description;
	author			= () => this.theme.config.author;
	coverPath   = () => this.theme.hasCover ? `/admin/themes/cover/${this.theme.config.identifier}.jpg` : '';

	layouts = () => {
		const layouts = this.theme.getLayouts();
		return [ ...layouts.keys() ].map(l => LayoutResolver(l, layouts.get(l)!));
	};
	layout = ({ identifier }: { identifier: string }) => {
		const layout = this.theme.getLayouts().get(identifier);
		return layout ? LayoutResolver(identifier, layout) : undefined;
	};
	format = () => this.theme.config.preprocessor.toUpperCase();
};

class PluginResolver {
	constructor(private plugin: Plugin) {}

	// TODO: id, user, created

	enabled     = () => this.plugin.isEnabled();

	name 				= () => this.plugin.config.name;
	identifier  = () => this.plugin.config.identifier;
	description = () => this.plugin.config.description;
	author			= () => this.plugin.config.author;
	coverPath   = () => this.plugin.hasCover ? `/admin/plugins/cover/${this.plugin.config.identifier}.jpg` : '';
};

class MediaResolver {
	constructor(private media: IMedia) {}

	id  				= () => this.media._id.toString();
	user 				= () => this.media.uploader;
	created 		= () => this.media._id.getTimestamp();
	// TODO: lastModified, lastModifier

	name 				= () => this.media.name;
	description = () => this.media.description;

	bytes       = () => this.media.bytes;
	extension   = () => this.media.extension;
	path				= () => this.media.fileName;
	url         = () => '/media/' + this.media.fileName + '.' + this.media.extension;
	
	size = () => {
		let size = this.media.size;
		if (!size || !size.width || !size.height) return null;
		return { x: size.width, y: size.height };
	};
}

export class RoleResolver {
	constructor(private role: IRole) {}

	id  				= () => this.role._id.toString();
	user 				= () => this.role.creator;
	created 		= () => this.role._id.getTimestamp();

	// TODO: lastModified, lastModifier

	name				= () => this.role.name;
	color 			= () => this.role.color;
	abilities		= () => this.role.abilities;
};

export class PageResolver {
	constructor(private page: Page.PageDocument, public path: string) {}

	name = () => this.page.name;
	description = () => this.page.description;

	layout = () => this.page.layout;
	content = () => JSON.stringify(this.page.elements);
};

export class IncludeResolver {
	constructor(private include: Page.IncludeDocument, public path: string) {}

	content = () => JSON.stringify(this.include.element);
};

export const Resolver = {
	info: async ({ info }: any) => {
		if (info) {
			let $set: any = {};
			for (let k of Object.keys(info)) $set['info.' + k] = info[k];
			await Properties.updateOne({}, { $set });
		}
		return InfoResolver;
	},
	quotas: QuotasResolver,

	users:   ()                     => Auth.listUsers().then(users => users.map(u => UserResolver(u))),
	themes:  (_: any, ctx: Context) => ctx.themes.listAll().map(t => new ThemeResolver(t)),
	plugins: (_: any, ctx: Context) => ctx.plugins.listAll().map(p => new PluginResolver(p)),
	media:   (_: any, ctx: Context) => ctx.media.listMedia().then(media => media.map(m => new MediaResolver(m))),
	roles:   ()                     => RoleModel.find({}).then((roles: IRole[]) => roles.map(r => new RoleResolver(r))),
	pages:   (_: any, ctx: Context) => ctx.pages.listPages(),

	user: async ({ id }: { id: string }) => {
		const u = await Auth.getUser(new ObjectID(id));
		return u ? UserResolver(u) : undefined;
	},

	page:    ({ path }: { path: string }, ctx: Context) => ctx.pages.getPage(path).then(page => new PageResolver(page, path)),
	include: ({ path }: { path: string }, ctx: Context) => ctx.pages.getInclude(path).then(include => new IncludeResolver(include, path)),
	layout:  ({ name }: { name: string }, _ctx: Context) => ({ identifier: name, html: DEFAULT_LAYOUT }),

	theme: ({ identifier }: { identifier: string }, ctx: Context) => {
		const t = ctx.themes.get(identifier);
		return t ? new ThemeResolver(t) : undefined;
	},
	plugin: ({ identifier }: { identifier: string }, ctx: Context) => {
		const p = ctx.plugins.get(identifier);
		return p ? new PluginResolver(p) : undefined;
	},

	enabled_themes:  ({ enabled }: any, ctx: Context) => ctx.themes.setEnabled(enabled),
	enabled_plugins: ({ enabled }: any, ctx: Context) => ctx.plugins.setEnabled(enabled),
	delete_media:    ({ media   }: any, ctx: Context) => {
		try { Promise.all(media.map((id: ObjectID) => ctx.media.removeMedia(id))); return true; }
		catch (e) { return false; }
	}
};
