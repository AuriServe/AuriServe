export default class EventEmitter {
	private callbacks: Record<string, Set<((...args: any[]) => void)>> = {};

	public bind(event: string, callback: ((...args: any[]) => void)): (() => void) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event].add(callback);
		return () => this.unbind(event, callback);
	}

	public unbind(event: string, callback: ((...args: any[]) => void)) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event].delete(callback);
	}

	public emit(event: string, ...args: any[]) {
		this.callbacks[event]?.forEach(cb => cb(...args));
	}
}
