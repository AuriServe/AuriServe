type LogFunction = (message: string, ...args: any[]) => void;

export default interface Log {
	info: LogFunction;
	debug: LogFunction;
	error: LogFunction;
	warn: LogFunction;
	fatal: LogFunction;
	trace: LogFunction;
	perf: LogFunction;

	perfStart: (identifier: string) => void;
	perfEnd: (identifier: string) => void;
}
