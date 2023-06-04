import fs from 'fs';
import path from 'path';
import { database, dataPath } from 'auriserve';

import { Form } from '../Type';

const FORMS_PATH = path.resolve(path.join(dataPath, 'forms'));

const FORMS = 'forms_forms';
const FORM_SUBMISSIONS = 'forms_formSubmissions';

export interface DatabaseForm {
	id: number;
	path: string;
}

export interface DatabaseFormSubmission {
	id: number;
	formId: number;
	time: number;
	data: string;
	read: boolean;
}

export function refreshFormCache() {
	database.prepare(`CREATE TABLE IF NOT EXISTS ${FORMS} (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		path TEXT UNIQUE
	)`).run();

	database.prepare(`CREATE TABLE IF NOT EXISTS ${FORM_SUBMISSIONS} (
		id INTEGER PRIMARY KEY,
		formId INTEGER REFERENCES ${FORMS}(id) ON DELETE CASCADE,
		time INTEGER,
		data TEXT,
		read INTEGER DEFAULT 0
	)`).run();

	const formFiles = fs.readdirSync(FORMS_PATH).filter(file => file.endsWith('.json'));
	const databaseForms = database.prepare(`SELECT path FROM ${FORMS}`).all();

	const removedForms = databaseForms.map(f => f.path).filter(form => !formFiles.includes(form));
	const addedForms = formFiles.filter(form => !databaseForms.find(dbForm => dbForm.path === form));

	database.transaction(() =>
		removedForms.forEach(f => database.prepare(`DELETE FROM ${FORMS} WHERE path = ?`).run(f)))();
	database.transaction(() =>
		addedForms.forEach(f => database.prepare(`INSERT INTO ${FORMS} (path) VALUES (?)`).run(f)))();
}

export function addFormSubmission(form: Omit<DatabaseFormSubmission, 'read' | 'id'>) {
	return database.prepare(`INSERT INTO ${FORM_SUBMISSIONS} (formId, time, data) VALUES (?, ?, ?)`)
		.run(form.formId, form.time, form.data).lastInsertRowid;
}

export function getForms(): DatabaseForm[] {
	return database.prepare(`SELECT * FROM ${FORMS}`).all();
}

export function getForm(id: number): Form | null {
	const formPath = path.join(dataPath, 'forms',
		database.prepare(`SELECT path FROM ${FORMS} WHERE id = ?`).get(id)?.path ?? '');
	try { return { ...JSON.parse(fs.readFileSync(formPath, 'utf8')), id }; }
	catch (e) { return null; }
}

export function countUnreadFormSubmissions(form: number) {
	return database.prepare(`SELECT COUNT(*) AS count FROM ${FORM_SUBMISSIONS} WHERE formId = ? AND read = 0`)
		.get(form).count;
}

export function getFormSubmissions(form: number): DatabaseFormSubmission[] {
	return database.prepare(`SELECT * FROM ${FORM_SUBMISSIONS} WHERE formId = ?`).all(form);
}

export function getFormSubmission(id: number): DatabaseFormSubmission | null {
	return database.prepare(`SELECT * FROM ${FORM_SUBMISSIONS} WHERE id = ?`).get(id);
}

export function markFormSubmissionRead(id: number, read: boolean) {
	return !!database.prepare(`UPDATE ${FORM_SUBMISSIONS} SET read = ? WHERE id = ?`).run(read ? 1 : 0, id).changes;
}

export function markAllFormSubmissionsRead(form: number) {
	return !!database.prepare(`UPDATE ${FORM_SUBMISSIONS} SET read = 1 WHERE formId = ?`).run(form).changes;
}

export function deleteFormSubmission(id: number) {
	return !!database.prepare(`DELETE FROM ${FORM_SUBMISSIONS} WHERE id = ?`).run(id).changes;
}
