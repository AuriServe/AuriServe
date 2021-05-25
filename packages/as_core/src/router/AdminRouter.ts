import fs from 'fs';
import path from 'path';
import Express from 'express';
import { Format } from 'as_common';
import { graphqlHTTP } from 'express-graphql';
import { UploadedFile } from 'express-fileupload';

import Router from './Router';
import Media from '../data/Media';
import * as Auth from '../data/Auth';
import Plugins from '../data/Plugins';
import PagesManager from '../PagesManager';
import { Schema, Resolver } from '../data/Graph';
import AuthRoute, { delay } from './AuthRoute';


// The page template, containing $MARKERS$ for page content.
const PAGE_TEMPLATE = fs.readFileSync(path.join(
	path.dirname(path.dirname(__dirname)), 'views', 'admin.html')).toString();

export default class AdminRouter extends Router {
	constructor(private dataPath: string, private app: Express.Application,
		private pages: PagesManager, private plugins: Plugins, private media: Media) { super(); }

	init() {
		const { rateLimit, authRoute } = AuthRoute();


		/**
		 * Attempts to authenticate a user with the supplied password.
		 *
		 * @param {string} req.body.user - The user's username.
		 * @param {string} req.body.pass - The user's password.
		 * @returns {200} An authentication token.
		 * @returns {403} An authentication error.
		 */

		this.router.post('/auth', rateLimit, async (req, res) => {
			const start = Date.now();
			try {
				const user = req.body.user;
				const pass = req.body.pass;

				if (typeof user != 'string' || typeof pass != 'string')
					throw 'Request is missing required parameters.';
				
				res.send(await Auth.getToken(user, pass));
			}
			catch (e) {
				await delay(1000, start);
				await delay(Math.random() * 150);
				res.status(403).send('Invalid username or password.');
			}
		});

 
 		/**
 		 * GraphQL endpoint for querying server data.
 		 * Also provides a graphiql access-point if loaded by a logged-in user.
 		 */

		this.router.use('/graphql', authRoute, graphqlHTTP({ schema: Schema, rootValue: Resolver, graphiql: true,
			context: { plugins: this.plugins, themes: this.pages.themes, media: this.media } }));


		/**
		 * Uploads a media asset and stores it in the media database.
		 *
		 * @param {string} req.body.name - The name of the asset.
		 * @param {string} req.body.identifier - The identifier for the asset.
		 * @param {string} req.files.file - The asset file.
		 * @returns {202} Indicates that the upload was successful.
		 * @returns {409} Indicates that the upload failed, has a status code in the body.
		 */

		this.router.post('/media/upload', authRoute, Router.safeRoute(async (req, res) => {
			const user = await Auth.testToken(req.cookies.tkn);

			const file: UploadedFile = req.files?.file as UploadedFile;
			if (!file) throw 'Request is missing a file.';

			const name: string = req.body.name;
			const identifier: string = Format.sanitize(req.body.identifier || req.body.name);

			if (typeof(name) != 'string' || typeof(identifier) != 'string')
				throw 'Request is missing required data.';

			const s = this.media.addMedia(user!._id, file, name, identifier);
			res.sendStatus(s ? 202 : 409);
		}));


		/**
		 * Replaces a media asset with the specified file.
		 *
		 * @param {string} req.body.replace - The identifier of the asset to replace.
		 * @param {string} req.files.file - The replacement asset file.
		 * @returns {202} Indicates that the upload was successful.
		 * @returns {409} Indicates that the upload failed, has a status code in the body.
		 */

		this.router.post('/media/replace', authRoute, Router.safeRoute(async (req, res) => {
			// const user = await Auth.testToken(req.cookies.tkn);

			const file: UploadedFile = req.files?.file as UploadedFile;
			if (!file) throw 'Request is missing a file.';

			const replace: string = req.body.replace;

			if (typeof(replace) !== 'string')
				throw 'Request is missing required data.';

			// TODO: Reimplement
			// let status = await this.media.addMedia(user, file, undefined, undefined, replace);
			// if (status !== MediaStatus.OK) res.status(409).send(status.toString());
			// else res.status(202).send(status.toString());
			res.sendStatus(400);
		}));


		/**
		 * Gets the cover image for a theme.
		 *
		 * @param {string} req.params.identifier - The identifier of the theme.
		 * @returns {Image} The cover image of the theme.
		 */

		this.router.get('/themes/cover/:identifier.jpg', authRoute, Router.safeRoute(async (req, res) =>
			res.sendFile(path.join(this.dataPath, 'themes', req.params.identifier, 'cover.jpg'))));


		// /**
		//  * Gets a layout template.
		//  *
		//  * @param {string} req.body.layout - The identifier for the layout.
		//  * @returns {200} The layout template.
		//  * @returns {403} An error indicating that the layout doesn't exist.
		//  */

		// this.router.post('/themes/layout', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body.layout !== 'string') throw 'Request is missing required data.';
		// 	const layouts = await this.themes.listLayouts();
		// 	if (!layouts.has(req.body.layout)) throw 'Layout doesn\'t exist';
		// 	res.send(layouts.get(req.body.layout));
		// }));


		// *
		//  * Refreshes the theme listings.
		//  *
		//  * @returns {200} A site data partial containing the theme listings.
		//  * @returns {403} An error.
		 

		// this.router.post('/themes/refresh', authRoute, Router.safeRoute(async (_, res) => {
		// 	await this.themes.refresh();
		// 	res.send(JSON.stringify(await this.getSiteData('themes&info')));
		// }));

		/*
		 * Plugin Routes
		 */

		this.router.get('/plugins/cover/:identifier.jpg', authRoute, Router.safeRoute((req, res) =>
			res.sendFile(path.join(this.dataPath, 'plugins', req.params.identifier, 'cover.jpg'))));

		// this.router.post('/plugins/refresh', authRoute, async (_, res) => {
		// 	await this.plugins.refresh();
		// 	res.send(JSON.stringify(await this.getSiteData('plugins&info')));
		// });

		// /*
		//  * Page Routes
		//  */

		// this.router.post('/pages/data', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body !== 'object' || typeof req.body.page !== 'string')
		// 		throw 'Request is missing required data.';

		// 	const data = await this.pages.getPreparedPage(req.body.page);
		// 	res.send(JSON.stringify(data));
		// }));

		// this.router.post('/pages/update', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body !== 'object' || typeof req.body.path !== 'string' || typeof req.body.body !== 'object')
		// 		throw 'Request is missing required data.';

		// 	await this.pages.updatePage(req.body.path, req.body.body);
		// 	res.sendStatus(200);
		// }));

		// /*
		//  * Role Routes
		//  */

		// this.router.post('/roles/update', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body !== 'object')
		// 		throw 'Request is missing required data.';

		// 	await this.db.updateRoles(req.body);
		// 	res.send(JSON.stringify(await this.getSiteData('roles')));
		// }));

		// /*
		//  * User Routes
		//  */

		// this.router.post('/users/role/add', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body !== 'object' || typeof req.body.user !== 'string' || typeof req.body.role !== 'string')
		// 		throw 'Request is missing required data.';
		// 	await this.db.userAddRoles(req.body.user, req.body.role.split(','));
		// 	res.send(JSON.stringify(await this.getSiteData('users')));
		// }));

		// this.router.post('/users/role/remove', authRoute, Router.safeRoute(async (req, res) => {
		// 	if (typeof req.body !== 'object' || typeof req.body.user !== 'string' || typeof req.body.role !== 'string')
		// 		throw 'Request is missing required data.';
		// 	await this.db.userRemoveRoles(req.body.user, req.body.role.split(','));
		// 	res.send(JSON.stringify(await this.getSiteData('users')));
		// }));

		/*
		 * Basic App Content
		 */

		this.router.use('/script', Express.static(path.join(path.dirname(path.dirname(__dirname)), 'interface', 'dist')));
		this.router.use('/asset', Express.static(path.join(path.dirname(path.dirname(__dirname)), 'interface', 'res')));

		this.router.get('/client.js', async (req, res) => {
			try {
				if (!await Auth.testToken(req.cookies.tkn)) throw 'Not auth';
				res.sendFile(path.join(path.dirname(path.dirname(__dirname)), 'interface', 'dist', 'client.js'));
			}
			catch (e) {
				if (typeof e !== 'string') e = 'Internal server error.';
				res.send('/* ' + e + ' */');
			}
		});

		this.router.get('(/*)?', async (_, res) => {
			const html = PAGE_TEMPLATE
				.replace('$PLUGINS$', `<script id='plugins' type='application/json'>${JSON.stringify({
					pluginScripts: this.plugins.listEnabled().filter(p => p.config.sources.editor?.script)
						.map(p => p.config.identifier + '/' + p.config.sources.editor!.script),
					pluginStyles: this.plugins.listEnabled().filter(p => p.config.sources.editor?.style)
						.map(p => p.config.identifier + '/' + p.config.sources.editor!.style) })}</script>`)
				.replace('$THEMES$', `<script id='themes' type='application/json'>${
					JSON.stringify({ themes: this.pages.themes.listEnabled() })}</script>`)
				.replace('$DEBUG$', '<script src=\'http://localhost:35729/livereload.js\' async></script>');
			res.send(html);
		});

		this.app.use('/admin', this.router);
	}
}
