import auriserve, { log, router } from 'auriserve';

import { sendMessage } from './SendMessage';
import { addFormSubmission, getForm } from './Database';
import { SelectClientFieldProps, TextAreaClientFieldProps, TextClientFieldProps } from '../Type';

type FormData = Record<string, string | number | boolean | string[] | null>;

class EnsureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

function ensure(value: any, message: string): asserts value {
	if (!value) throw new EnsureError(message);
}

function validateText(field: TextClientFieldProps | TextAreaClientFieldProps,
	body: Record<string, string>, data: FormData) {
	const value = body[field.id];

	if (value === undefined) {
		ensure(!(field.constraints?.required ?? true), `'${field.label}' is required.`);
		data[field.id] = null;
		return;
	}

	ensure(value !== undefined, `Missing value for '${field.label}'.`)
	ensure(typeof value === 'string', `Invalid value for '${field.id}'.`);
	ensure(!field.constraints?.required || value.length > 0, `Missing required value for '${field.label}'.`);
	ensure(value.length >= (field.constraints?.minLength ?? 0), `Value for '${field.label}' is too short.`);
	ensure(value.length <= (field.constraints?.maxLength ?? Infinity), `Value for '${field.label}' is too long.`);
	ensure(!field.constraints?.pattern || new RegExp(field.constraints.pattern, 'u').test(value),
		`Value for '${field.label}' does not match required pattern.`);
	data[field.id] = value;
}

// function validateCheckbox(field: CheckboxFieldProps, body: Record<string, string>, data: FormData) {
// 	ensure(false, 'TODO: Checkbox fields.');
// }

function validateSelect(field: SelectClientFieldProps, body: Record<string, string>, data: FormData) {
	let value = body[field.id];
	if (Array.isArray(value)) value = value.join(',');

	if (value === '#radio_multi#') value = field.options
		.map(option => option.id).filter(id => body[`${field.id}#${id}`] === 'on').join(',');

	if (value === undefined || value === '') {
		ensure(!(field.constraints?.required ?? true), `'${field.label}' is required.`);
		data[field.id] = field.multiple ? [] : null;
		return;
	}

	ensure(typeof value === 'string', `Invalid value for '${field.id}'.`);

	if (value.includes(',')) {
		if (!field.multiple) ensure(false, `Multiple options for '${field.label}' are not allowed.`);
		const values = value.split(',');
		for (const value of values) ensure(field.options.find(option => option.id === value),
			`Invalid options for '${field.label}'.`);
		data[field.id] = values;
	}
	else {
		ensure(field.options.find(option => option.id === value), `Invalid option for '${field.label}'.`);
		data[field.id] = field.multiple ? [ value ] : value;
	}
}

function submitForm(formID: number, body: Record<string, string>) {
	ensure(!isNaN(formID), 'Invalid form ID.');
	const form = getForm(formID);
	ensure(form, 'Form not found.');

	const data: FormData = {};

	for (const field of form.fields) {
		switch (field.type) {
			default:
				ensure(false, `Unhandled field type '${(field as any).type}'.`);
				break;
			case 'text':
			case 'tel':
			case 'email':
			case 'textarea': {
				validateText(field, body, data);
				break;
			}
			// case 'checkbox': {
			// 	validateCheckbox(field, body, data);
			// 	break;
			// }
			case 'select': {
				validateSelect(field, body, data);
				break;
			}
		}
	}

	return addFormSubmission({ data: JSON.stringify(data), formId: formID, time: Date.now() });
}

export function registerRoute() {
	const handler = router.post('/form/submit', (req, res) => {
		try {
			const returnPath = req.body['#return_path#'];
			const isFetch = req.body['#fetch#'] === 'true';

			ensure(typeof returnPath === 'string', 'Invalid return path.');

			let error = '';
			const formID = parseFloat(req.body['#form_id#']);

			if (!req.body['#email#']) {
				try {
					const id = submitForm(formID, req.body);
					sendMessage(id as number);
				}
				catch (e) {
					if (e instanceof EnsureError) error = e.message;
					else throw e;
				}
			}

			if (error) {
				if (isFetch) res.status(400).send(error);
				else res.redirect(`${returnPath}?submitted=false&error=${encodeURIComponent(error)}#form-${formID}-error`);
			}
			else if (isFetch) res.status(200).send();
			else res.redirect(`${returnPath}?submitted=true#form-${formID}-submitted`);
		}
		catch (e) {
			log.error((e as any).toString());
			res.sendStatus(500);
		}
	});

	auriserve.once('cleanup', () => router.remove(handler));
}
