import { assert } from 'common';
import { sendMail } from 'sendmail';
import { database as rawDb } from 'auriserve';
// eslint-disable-next-line
// @ts-ignore
import { h, renderToString } from 'preact';

import Message from '../common/Message';
import { getForm, getFormSubmission } from './Database';

const DOMAIN: string = rawDb.prepare('SELECT domain FROM site_info LIMIT 1').get().domain;

export async function sendMessage(id: number) {
	const submission = getFormSubmission(id);
	assert(submission, 'Submission not found.');
	const form = getForm(submission.formId);
	assert(form, 'Form not found.')

	if (!form.server?.mailTo?.length) return;

	const content = renderToString(h(Message, {
		form,
		time: submission.time,
		domain: DOMAIN,
		submissionId: submission.id,
		data: JSON.parse(submission.data)
	}));

	await sendMail({
		content,
		to: form.server.mailTo,
		subject: `${form.name} Form Submission.`,
		replyTo: JSON.parse(submission.data)[form.dashboard.reply!],
	});
}
