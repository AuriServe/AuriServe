export interface WatcherConstructor {
	new (paths: string[]): Watcher;
}

export default interface Watcher {
	bind(cb: () => void): void;
	unbind(cb: () => void): boolean;

	start(): void;
	stop(): void;
}
