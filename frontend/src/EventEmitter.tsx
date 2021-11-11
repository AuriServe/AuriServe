export default class EventEmitter {
	private callbacks: Record<string, Set<Function>> = {};

	public bind(event: string, callback: Function): (() => void) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event].add(callback);
		return () => this.unbind(event, callback);
	}

	public unbind(event: string, callback: Function) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event].delete(callback);
	}

	public emit(event: string, ...args: any[]) {
		this.callbacks[event]?.forEach(cb => cb(...args));
	}
}
