/**
 * Formats log4js's pattern based on the information available,
 * configures the perf log level, and allows easy access to logger instance methods.
 * Also adds perfStart and perfEnd methods, which allow easy performance logging.
 */

import log4js, { LoggingEvent } from 'log4js';

const DEV_PATTERN = '[ %[%-5p%] | %x{location} ] %[%m%]';
const BUILD_PATTERN = '[ %d | %[%-5p%] ] %[%m%]';

const dev = !__filename.startsWith('/snapshot');
const pattern = dev ? DEV_PATTERN : BUILD_PATTERN;

log4js.configure({
	levels: { PERF: { value: log4js.levels.TRACE.level, colour: 'yellow' } } as any,
	appenders: {
		out: {
			type: 'stdout',
			pattern,
			layout: {
				type: 'pattern',
				pattern,
				tokens: {
					location(event: any) {
						const fileName = event.fileName.split('/').pop();
						const str = `${fileName}:${event.lineNumber}:${event.columnNumber}`;
						return str.padEnd(24);
					},
				},
			},
		},
	},
	categories: { default: { appenders: ['out'], level: 'info', enableCallStack: dev } },
});

const logger = log4js.getLogger();

const activePerfs: Map<string, [number, number]> = new Map();

const perfStart = (identifier: string) => {
	activePerfs.set(identifier, process.hrtime());
};

const perfEnd = (identifier: string) => {
	const perf = activePerfs.get(identifier);
	if (!perf) logger.warn("Attempted to perf invalid identifier '%s'.", identifier);
	else {
		const elapsed = process.hrtime(perf)[1] / 1000000;
		(logger as any).perf('%s took %s ms.', identifier, elapsed.toFixed(3));
		activePerfs.delete(identifier);
	}
};

export default {
	perf: (logger as any).perf.bind(logger),
	perfStart,
	perfEnd,
	info: logger.info.bind(logger),
	debug: logger.debug.bind(logger),
	error: logger.error.bind(logger),
	warn: logger.warn.bind(logger),
	fatal: logger.fatal.bind(logger),
	trace: logger.trace.bind(logger),
	setLogLevel: (level: string) => (logger.level = level),
};
