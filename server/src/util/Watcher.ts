import fs, { FSWatcher } from 'fs';
import debounce from 'debounce';

export default class Watcher {
	private callbacks: Set<() => void> = new Set();
	private watchers: FSWatcher[] = [];
	private onChangeDebounced: any;

	constructor(private paths: string[]) {
		this.onChangeDebounced = debounce(this.onChange, 200);
		this.start();
	}

	bind(cb: () => void) {
		this.callbacks.add(cb);
	}

	unbind(cb: () => void) {
		return this.callbacks.delete(cb);
	}

	start() {
		this.stop();
		this.watchers = this.paths.map((path) => {
			return fs.watch(path, { persistent: false }, () => this.onChangeDebounced());
		});
	}

	stop() {
		this.watchers.map((watcher) => watcher.close());
		this.watchers = [];
		this.onChangeDebounced.clear();
	}

	private onChange() {
		this.callbacks.forEach((cb) => cb());
	}
}
