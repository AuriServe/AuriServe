export default class EventEmitter<EL> {
	private callbacks: {
		[Property in keyof EL]: Set<(...args: any[]) => void>;
	} = {} as any;

	public bind<E extends keyof EL>(event: E, callback: EL[E]): () => void {
		this.callbacks[event] ??= new Set();
		this.callbacks[event]!.add(callback as any);
		return () => this.unbind(event, callback);
	}

	public unbind<E extends keyof EL>(event: E, callback: EL[E]) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event]!.delete(callback as any);
	}

	public emit<E extends keyof EL>(
		event: E,
		...args: {
			[Property in keyof EL]: EL[Property] extends (...args: any[]) => void
				? Parameters<EL[Property]>
				: never;
		}[E]
	) {
		this.callbacks[event]?.forEach((cb) => cb(...args));
	}
}
