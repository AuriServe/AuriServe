import { h } from 'preact';

import { formatDate, formatTime } from './Date';
import { ClientFieldProps, DashboardLayoutProps, Form, SelectClientFieldProps } from '../Type';

interface FieldProps<T> {
	value: T;
	layout: DashboardLayoutProps;
	field: ClientFieldProps;
}

function Field(props: FieldProps<string>) {
	return (
		<label class='field'>
			<p class='label'>{props.field.shortName ?? props.field.label}</p>
			<div class='value'>{props.value}</div>
		</label>
	)
}

function SelectField(props: FieldProps<string | string[]>) {
	const valueArr = Array.isArray(props.value) ? props.value : [ props.value ];
	return (
		<label class='field'>
			<p class='label'>{props.field.shortName ?? props.field.label}</p>
			<div class='value'>{valueArr.map(v => {
				const opt = (props.field as SelectClientFieldProps).options.find(o => o.id === v);
				return opt?.shortName ?? opt?.label ?? v;
			}).join(', ')}</div>
		</label>
	)
}

interface Props {
	form: Form;
	time: number;
	domain: string;
	submissionId: number;
	data: Record<string, string | string[] | boolean | null>;
}

export default function Message(props: Props) {
	return (
		<html>
			<head>
				<title>New {props.form.name} Form Submission.</title>
				<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
				<meta http-equiv='X-UA-Compatible' content='IE=edge'/>
				<meta name='viewport' content='width=device-width, initial-scale=1.0'/>
				<style dangerouslySetInnerHTML={{ __html: `
					.content {
						display: block;
						max-width: 512px;
						margin: 0 auto;
						padding: 24px 12px;
					}

					.field {
						display: block;
						width: 100%;
						padding: 8px 0px;
					}

					.label {
						font-size: 13px;
						font-weight: bold;
						padding-bottom: 4px;
						margin: 0;
					}

					.value {
						background-color: #eee;
						height: auto;
						width: 100%;
						font-family: sans-serif;
						font-size: 16px;
						padding: 16px;
						white-space: pre-line;
					}

					.online {
						font-size: 14px;
					}
				`}}/>
			</head>
			<body>
				<div class='content'>
					<table>
						<thead>
							<tr>
								<td>
									<p class='title'>
										A new {props.form.name} form was submitted on{' '}
										{formatDate(props.time)} at {formatTime(props.time)}.<br/>
										{props.domain &&
											<a class='online' href={`https://${props.domain}/dashboard/forms/${props.form.id}/${props.submissionId}`}>
											View and reply to this form submission online</a>}
									</p>
								</td>
							</tr>
						</thead>
						<tbody>
							{props.form.dashboard.layout.map((layout) =>
								<tr key={layout.id}><td>
									{(() => {
										switch (layout.id) {
											default: {
												const field = props.form.fields.find(field => field.id === layout.id);
												if (!field) return null;
												if (field.type === 'select')
													return <SelectField layout={layout} field={field} value={(props.data[field.id] ?? '') as string} />;
												return <Field layout={layout} field={field} value={(props.data[field.id] ?? '') as string} />;
											}
											case "#space": {
												return null;
											}
										}
									})()}
								</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</body>
		</html>
	)
}
