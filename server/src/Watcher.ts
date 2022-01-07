import fs from 'fs';
import debounce from 'debounce';

export default class Watcher {
	private callbacks: (() => void)[] = [];
	private controller: AbortController = new AbortController();
	private onChangeDebounced: any;

	constructor(private paths: string[]) {
		this.onChangeDebounced = debounce(this.onChange, 200);
		this.start();
	}

	bind(cb: () => void) {
		this.callbacks.push(cb);
	}

	unbind(cb: () => void) {
		this.callbacks = this.callbacks.filter(c => c !== cb);
	}

	start() {
		this.stop();
		this.controller = new AbortController();
		this.paths.forEach(async path => {
			fs.watch(path, { persistent: false, signal: this.controller.signal }, () => this.onChangeDebounced());
		});
	}

	stop() {
		this.controller.abort();
		this.onChangeDebounced.clear();
	}

	private onChange() {
		this.callbacks.forEach(cb => cb());
	}
}
