export default class EventEmitter<EL> {
	private callbacks: {
		[Property in keyof EL]?: Set<EL[Property]>;
	} = {};

	public bind<E extends keyof EL>(event: E, callback: EL[E]): () => void {
		this.callbacks[event] ??= new Set();
		this.callbacks[event]!.add(callback);
		return () => this.unbind(event, callback);
	}

	public unbind<E extends keyof EL>(event: E, callback: EL[E]) {
		this.callbacks[event] ??= new Set();
		this.callbacks[event]!.delete(callback);
	}

	public emit<E extends keyof EL>(
		event: E,
		...args: EL[E] extends (...args: any[]) => void ? Parameters<EL[E]> : [never]
	) {
		this.callbacks[event]?.forEach((cb) =>
			(cb as any as (...args: any[]) => void)(...args)
		);
	}
}
