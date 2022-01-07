import path from 'path';
import { promises as fs } from 'fs';

import Manifest from './Manifest';
import PluginManager from './PluginManager';

type EventFn = (event: any) => void;
type EventProps = { once: boolean };

export default class Plugin {
	readonly identifier: string;
	readonly watch: string[];

	private enabled: boolean = false;

	private events: Map<string, Map<EventFn, EventProps>> = new Map();

	constructor(private manager: PluginManager, readonly manifest: Manifest) {
		this.identifier = manifest.identifier;

		this.watch = manifest.watch ?? Object.values(manifest.entry).reduce<string[]>((paths, entry) => {
			if (typeof entry === 'string') paths.push(path.join(this.manager.pluginsPath, this.identifier, entry));
			else paths.push(...(Object.values(entry) as string[]).map(sourcePath =>
				path.join(this.manager.pluginsPath, this.identifier, sourcePath)));
			return paths;
		}, []);
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	async enable(forceReload: boolean = false): Promise<boolean> {
		if (this.enabled) {
			if (forceReload) this.disable();
			else return false;
		}

		this.enabled = true;

		const serverEntry = this.getEntry('server', 'script');
		if (serverEntry) {
			const entryPath = await fs.realpath(path.resolve(this.manager.pluginsPath, this.identifier, serverEntry));
			delete require.cache[entryPath];

			(global as any)._CONTEXT = this.createContext();
			require(entryPath);
			delete (global as any)._CONTEXT;
		}

		return true;
	}

	disable(shutdown: boolean = false) {
		if (!this.enabled) return false;
		this.emit('cleanup', { shutdown });
		this.events.clear();
		this.enabled = false;
		return true;
	}

	getEntry(context: 'server' | 'client', type: 'script' | 'style'): string | null {
		const entry = this.manifest.entry[context];
		if (!entry) return null;
		if (typeof entry === 'string') {
			if (type === 'script') return entry;
			else return null;
		}
		if ((entry as any)[type]) return (entry as any)[type];
		return null;
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
		let map = this.events.get(event);
		if (!map) return;

		for (let [ fn, props ] of map) {
			fn(eventObj);
			if (props.once) map.delete(fn);
		}
	}

	private createContext() {
		const core: any = {
			router: this.manager.routerApi,
			on: this.on.bind(this),
			once: this.once.bind(this),
			off: this.off.bind(this),
			emit: this.manager.emit.bind(this.manager),
			api: new Proxy({}, {
				get: (_, req) => {
					switch(req) {
					case 'core': return core;
					case 'has': return (identifier: string) => this.manager.apiRegistry.has(identifier);
					case 'export': return (identifier: string, api: any) => this.manager.apiRegistry.set(identifier, api);
					case 'unexport': return (identifier: string) => {
						if (!this.manager.apiRegistry.has(identifier)) return false;
						this.manager.apiRegistry.delete(identifier);
						return true;
					};
					default: {
						if (!this.manager.apiRegistry.has(req.toString()))
							throw new Error(`Required API '${req.toString()}' has not been exported.`);
						return this.manager.apiRegistry.get(req.toString());
					}
					}
				},
				set: (_, identifier, api) => {
					this.manager.apiRegistry.set(identifier.toString(), api);
					return true;
				}
			})
		};

		return core.api;
	}
}
