import mime from 'mime';
import jimp from 'jimp';
import path from 'path';
import Express from 'express';
import { promises as fs, constants as fsc } from 'fs';

import Router from './Router';
import Logger from '../Logger';
import Plugins from '../data/Plugins';
import PagesManager from '../PagesManager';
import { OUT_FILE } from '../data/Themes';

export default class PagesRouter extends Router {

	constructor(private dataPath: string, private app: Express.Application,
		private pages: PagesManager, private plugins: Plugins) { super(); }

	init() {
		this.router.get('/media/:asset', async (req, res, next) => {

			const validImageExtensions = [ 'png', 'jpg' ];
			const validResolutions = { 'preload': 32, 'thumbnail': 128 };

			let resolution: string = Object.keys(validResolutions).filter(res => (req.query.res || '') === (res))[0];
			let matched: string = validImageExtensions.filter(ext => req.params.asset.endsWith('.' + ext))[0];
			if (!resolution || !matched) return next();

			const p = path.join(this.dataPath, 'media', req.params.asset);
			const destP = path.join(this.dataPath, 'media', '.cache', req.params.asset + '.' + req.query.res);

			try { await fs.access(destP, fsc.R_OK); }
			catch {
				try { await fs.access(p, fsc.R_OK); }
				catch { return next(); }

			  const image = await jimp.read(path.join(this.dataPath, 'media', req.params.asset));
			  const size = (validResolutions as any)[req.query.res as string];
			  const width = image.bitmap.width;
			  const height = image.bitmap.height;
			  const factor = size / Math.max(width, height);
			  await image.resize(width * factor, height * factor);
			  await image.writeAsync(destP);
			}

			res.contentType(mime.getType(matched) ?? '');
			res.sendFile(destP);
		});

		this.router.use('/media', Express.static(path.join(this.dataPath, 'media')));
		this.router.use('/styles.css', async (_, res) => {
			const filePath = path.join(this.dataPath, 'themes', OUT_FILE);
			const file = (await fs.readFile(filePath)).toString();
			res.header('Content-Type', 'text/css; charset=UTF-8').send(file);
		});

		this.router.use('/plugin/:identifier/:file', async (req, res, next) => {
			try {
				let plugins = this.plugins.listEnabled().filter(p => p.config.identifier === req.params.identifier);
				if (plugins.length === 0) throw `There is no loaded plugin with identifier ${req.params.identifier}.`;
				Express.static(path.join(this.dataPath, 'plugins', req.params.identifier,
					plugins[0].config.sourceRoot, req.params.file))(req, res, next);
			}
			catch (e) {
				res.status(403).send(e);
			}
		});

		this.router.get('/plugin/styles/:identifier.css', (req, res) => {
			const plugins = this.plugins.listEnabled().filter(p => p.config.identifier === req.params.identifier);
			if (plugins.length !== 1) { res.sendStatus(404); return; }
			const plugin = plugins[0];

			if (!plugin.config.sources.client?.style) { res.sendStatus(404); return; }
			res.sendFile(path.join(this.dataPath, 'plugins', plugin.config.identifier, plugin.config.sources.client.style));
		});

		this.router.get('*', async (req, res) => {
			try { res.send(await this.pages.render(req.params[0])); }
			catch (e) {
				if (e.type && e.error) {
					let [ status, page ] = this.pages.renderError(e);
					res.status(status).send(page);
				}
				else {
					Logger.error('Encountered an error assembling file %s.\n %s', req.params[0], e);
				}
			}
		});

		this.app.use(this.router);
	}
}
