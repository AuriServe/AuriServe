import util from 'util';

/**
 * Formats log4js's pattern based on the information available,
 * configures the perf log level, and allows easy access to logger instance methods.
 * Also adds perfStart and perfEnd methods, which allow easy performance logging.
 */

// import log4js from 'log4js';

// const DEV_PATTERN = '[ %[%-5p%] | %x{location} ] %[%m%]';
// const BUILD_PATTERN = '[ %d | %[%-5p%] ] %[%m%]';

// const dev = !__filename.startsWith('/snapshot');
// const pattern = dev ? DEV_PATTERN : BUILD_PATTERN;

// log4js.configure({
// 	levels: { PERF: { value: log4js.levels.TRACE.level, colour: 'yellow' } } as any,
// 	appenders: {
// 		out: {
// 			type: 'stdout',
// 			pattern,
// 			layout: {
// 				type: 'pattern',
// 				pattern,
// 				tokens: {
// 					location(event: any) {
// 						const fileName = event.fileName.split('/').pop();
// 						const str = `${fileName}:${event.lineNumber}:${event.columnNumber}`;
// 						return str.padEnd(24);
// 					},
// 				},
// 			},
// 		},
// 	},
// 	categories: { default: { appenders: ['out'], level: 'info', enableCallStack: dev } },
// });

// const logger = log4js.getLogger();

// export default {
// 	perf: (logger as any).perf.bind(logger),
// 	perfStart,
// 	perfEnd,
// 	info: logger.info.bind(logger),
// 	debug: logger.debug.bind(logger),
// 	error: logger.error.bind(logger),
// 	warn: logger.warn.bind(logger),
// 	fatal: logger.fatal.bind(logger),
// 	trace: logger.trace.bind(logger),
// 	setLogLevel: (level: string) => (logger.level = level),
// };

const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
const labels = ['TRACE', 'DEBUG', 'INFO.', 'WARN.', 'ERROR', 'FATAL'];
let currentLevel = levels.indexOf('info');

function logFunction(level: string, color: string) {
	return (...args: any[]) => {
		const index = levels.indexOf(level);
		if (index >= currentLevel) {
			console.log(
				`[\u001B[${color}m${labels[index]
					.toUpperCase()
					.padEnd(5)}\u001B[0m] \u001B[${color}m${util.format(...args)}\u001b[0m`,
				// ...args.slice(1)
			);
		}
	};
}

function setLevel(level: string) {
	currentLevel = levels.indexOf(level);
}

const activePerfs: Map<string, [number, number]> = new Map();

function perfStart(identifier: string) {
	activePerfs.set(identifier, process.hrtime());
};

function perfEnd(identifier: string) {
	const perf = activePerfs.get(identifier);
	const fn = logFunction('debug', '93');
	if (!perf) fn("Attempted to perf invalid identifier '%s'.", identifier);
	else {
		const elapsed = process.hrtime(perf)[1] / 1000000;
		fn('%s took %s ms.', identifier, elapsed.toFixed(3));
		activePerfs.delete(identifier);
	}
};

export default {
	perf: logFunction('debug', '93'),
	perfStart,
	perfEnd,
	info: logFunction('info', '92'),
	debug: logFunction('debug', '96'),
	error: logFunction('error', '91'),
	warn: logFunction('warn', '93'),
	fatal: logFunction('fatal', '91'),
	trace: logFunction('trace', '93'),
	setLogLevel: setLevel,
};
