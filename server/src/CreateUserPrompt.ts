import Logger from './Logger';
import * as Auth from './data/Auth';
import Role from './data/model/Role';

import prompt from 'prompt';

export default function createUserPrompt() {
	prompt.start();
	prompt.message = '';
	prompt.delimiter = '';

	prompt.get([{
		name: 'username',
		description: 'Please enter a username:',
		message: 'Username must be between 3 and 32 characters long.',
		pattern: /^\w{3,32}$/g,
		required: true
	}, {
		name: 'name',
		description: 'Please enter a name:',
		message: 'Name must be between 3 and 32 characters long.',
		pattern: /^[\w ]{3,32}$/g,
		required: true
	}, {
		name: 'password',
		description: 'Please enter a password:',
		message: 'Password must be at least 8 characters long.',
		pattern: /.{8,}/g,
		required: true,
		// @ts-ignore
		hidden: true,
		replace: '*'
	}], async (err: string, result: { username: string; name: string; password: string }) => {
		// @ts-ignore
		prompt.stop();

		if (err) {
			// @ts-ignore
			logger.fatal('Failed to create a new administrator.\n %s', err);
			process.exit(1);
		}

		try {
			const { _id: id } = await Auth.addUser(result.username, result.password);
			Auth.addRolesToUser(id, (await Role.findOne({ name: 'Administrator' }))!._id);
			Logger.info('Created new administrator account %s.', result.username);
		}
		catch (e) {
			Logger.info('Failed to create new administrator account %s.\n %s', result.username, e);
			process.exit(1);
		}
	});
}
