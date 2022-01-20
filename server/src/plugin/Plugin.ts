import path from 'path';
import { promises as fs } from 'fs';

import Log from '../Log';
import { parse, stringify } from './YAML';
import { ParsedManifest } from './Manifest';
import PluginManager from './PluginManager';

type EventFn = (event: any) => void;
type EventProps = { once: boolean };

export default class Plugin {
	private enabled = false;
	private events: Map<string, Map<EventFn, EventProps>> = new Map();

	constructor(private manager: PluginManager, readonly manifest: ParsedManifest) {}

	isEnabled(): boolean {
		return this.enabled;
	}

	async enable(forceReload = false): Promise<boolean> {
		if (this.enabled) {
			if (forceReload) this.disable();
			else return false;
		}

		this.enabled = true;

		if (this.manifest.entry.server.script) {
			const entryPath = await fs.realpath(
				path.resolve(
					this.manager.pluginsPath,
					this.manifest.identifier,
					this.manifest.entry.server.script
				)
			);

			delete require.cache[entryPath];
			(global as any)._CONTEXT = this.createContext();
			require(entryPath);
			delete (global as any)._CONTEXT;
		}

		return true;
	}

	disable(shutdown = false) {
		if (!this.enabled) return false;
		this.emit('cleanup', { shutdown });
		this.events.clear();
		this.enabled = false;
		return true;
	}

	on(event: string, fn: EventFn) {
		if (!this.events.has(event)) this.events.set(event, new Map());
		this.events.get(event)!.set(fn, { once: false });
	}

	once(event: string, fn: EventFn) {
		if (!this.events.has(event)) this.events.set(event, new Map());
		this.events.get(event)!.set(fn, { once: true });
	}

	off(event: string, fn: EventFn) {
		if (!this.events.has(event)) return;
		this.events.get(event)!.delete(fn);
	}

	emit(event: string, eventObj: any) {
		const map = this.events.get(event);
		if (!map) return;

		for (const [fn, props] of map) {
			fn(eventObj);
			if (props.once) map.delete(fn);
		}
	}

	private createContext() {
		const core: any = {
			router: this.manager.routerApi,
			log: Log,
			database: this.manager.database,
			YAML: { parse, stringify },
			on: this.on.bind(this),
			once: this.once.bind(this),
			off: this.off.bind(this),
			emit: this.manager.emit.bind(this.manager),
			api: new Proxy(
				{},
				{
					get: (_, req) => {
						switch (req) {
							case 'core':
								return core;
							case 'has':
								return (identifier: string) => this.manager.apiRegistry.has(identifier);
							case 'export':
								return (identifier: string, api: any) =>
									this.manager.apiRegistry.set(identifier, api);
							case 'unexport':
								return (identifier: string) => {
									if (!this.manager.apiRegistry.has(identifier)) return false;
									this.manager.apiRegistry.delete(identifier);
									return true;
								};
							default: {
								if (!this.manager.apiRegistry.has(req.toString()))
									throw new Error(
										`Required API '${req.toString()}' has not been exported.`
									);
								return this.manager.apiRegistry.get(req.toString());
							}
						}
					},
					set: (_, identifier, api) => {
						this.manager.apiRegistry.set(identifier.toString(), api);
						return true;
					},
				}
			),
		};

		return core.api;
	}
}
