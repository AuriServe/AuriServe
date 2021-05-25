// import log4js from 'log4js';
// const logger = log4js.getLogger();

// import Database from './Database';

// export default class SuperUserPrompt {
// 	constructor(db: Database) {
// 		const prompt = require('prompt');
// 		prompt.start();
// 		prompt.message = '';
// 		prompt.delimiter = '';

// 		prompt.get([{
// 			name: 'username',
// 			description: 'Please enter a username:',
// 			message: 'Username must be between 3 and 32 characters long.',
// 			pattern: /^\w{3,32}$/g,
// 			required: true
// 		}, {
// 			name: 'name',
// 			description: 'Please enter a name:',
// 			message: 'Name must be between 3 and 32 characters long.',
// 			pattern: /^[\w ]{3,32}$/g,
// 			required: true
// 		}, {
// 			name: 'password',
// 			description: 'Please enter a password:',
// 			message: 'Password must be at least 8 characters long.',
// 			pattern: /.{8,}/g,
// 			required: true,
// 			hidden: true,
// 			replace: '*'
// 		}], async (err: string, result: { username: string; name: string; password: string }) => {
// 			prompt.stop();

// 			if (err) {
// 				logger.fatal('Failed to create a new administrator.\n %s', err);
// 				process.exit(1);
// 			}

// 			try {
// 				await db.createAccount({ identifier: result.username, name: result.name, pass: result.password, roles: [ 'Administrator' ] });
// 				logger.info('Created new administrator account %s.', result.username);
// 			}
// 			catch (e) {
// 				logger.info('Failed to create new administrator account %s.\n %s', result.username, e);
// 				process.exit(1);
// 			}
// 		});
// 	}
// }
