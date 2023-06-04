
import path from 'path';
import { promises as fs } from 'fs';
import * as dashboard from 'dashboard';
import auriserve, { dataPath } from 'auriserve';
import { addElement, addStylesheet, removeElement, removeStylesheet } from 'elements';

import Form from '../client/Form';
import { refreshFormCache, getFormSubmissions, getForms,
	countUnreadFormSubmissions, markFormSubmissionRead, deleteFormSubmission, getForm, markAllFormSubmissionsRead } from './Database';
import { registerRoute } from './Submit';

import '../Style.pcss';

addElement(Form);
auriserve.once('cleanup', () => removeElement(Form.identifier));

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);
auriserve.once('cleanup', () => removeStylesheet(styles));

registerRoute();
refreshFormCache();

// auriserve.router.get('/res/elements-base/pdf_worker.js', (_, res) => {
// 	res.sendFile(path.join(auriserve.dataPath, '/plugins/elements-base/build/', worker));
// });

// auriserve.router.get('/res/elements-base/:file', (req, res) => {
// 	res.sendFile(path.join(auriserve.dataPath, '/plugins/elements-base/build/', req.params.file));
// });


dashboard.extendGQLSchema(`
	type Form {
		id: Int!
		path: String!
		name: String!
		unread: Int!
	}

	type FormSubmission {
		id: Int!
		formId: Int!
		time: Float!
		data: String!
		read: Boolean!
	}

	extend type Query {
		forms: [Form!]!
		form(id: Int!): String,
		formSubmissions(form: Int!): [FormSubmission!]!
	}

	extend type Mutation {
		markFormSubmissionRead(id: Int!, read: Boolean!): Boolean!
		markAllFormSubmissionsRead(form: Int!): Boolean!
		deleteFormSubmission(id: Int!): Boolean!
	}
`);

const resolver = dashboard.gqlResolver;

resolver.forms = () => {
	const forms = getForms();
	return Promise.all(forms.map(async form => {
		const json = JSON.parse(await fs.readFile(path.join(dataPath, 'forms', form.path), 'utf-8'));
		const unread = countUnreadFormSubmissions(form.id);
		return {
			...form,
			name: json.name,
			unread
		};
	}));
};

resolver.formSubmissions = ({ form }: { form: number }) => {
	const submissions = getFormSubmissions(form);
	return submissions.map(submission => ({
		...submission,
		read: !!submission.read,
	}));
};

resolver.form = ({ id }: { id: number }) => {
	const form = getForm(id);
	if (form == null) return null;
	return JSON.stringify(form);
};

resolver.markFormSubmissionRead = ({ id, read }: { id: number, read: boolean }) => {
	return markFormSubmissionRead(id, read);
};

resolver.markAllFormSubmissionsRead = ({ form }: { form: number }) => {
	return markAllFormSubmissionsRead(form);
};

resolver.deleteFormSubmission = ({ id }: { id: number }) => {
	return deleteFormSubmission(id);
};
