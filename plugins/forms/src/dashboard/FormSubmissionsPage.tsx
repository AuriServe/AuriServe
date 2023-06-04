import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { tw, Icon, Card, executeQuery, useLocation, useNavigate, Button } from 'dashboard';

import { Form } from '../Type';
import RowField from './RowField';
import SidebarItem from './SidebarItem';
import { formatDate, formatTime } from '../common/Date';
import FormSubmissionModal from './FormSubmissionModal';
import { DatabaseFormSubmission } from '../server/Database';

export type FormSubmission =
	Omit<DatabaseFormSubmission, 'read' | 'data'> & { data: Record<string, any>, read: boolean };

export default function FormSubmissionsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [ forms, setForms ] = useState<Map<number, { id: number, name: string, unread: number }> | null>(null);
	const [ form, setForm ] = useState<Form | null>(null);
	const [ submissions, setSubmissions ] = useState<FormSubmission[] | null>(null);

	let formId: number | null = parseInt(location.pathname.replace(/\/forms\/?/, ''), 10);
	let submissionId: number | null = parseInt(location.pathname.replace(/\/forms(?:\/\d+\/?)?/, ''), 10);
	if (isNaN(submissionId)) submissionId = null;
	if (isNaN(formId)) formId = null;

	useEffect(() => {
		if (forms?.size) return;
		executeQuery('{ forms { id, path, name, unread } }').then(({ forms }) => {
			const formsMap: Map<number, { id: number, name: string, unread: number }> =
				new Map(forms.map((f: any) => ([ f.id, f ])));
			setForms(formsMap);
			if ((forms.length > 0 && formId == null) || (formId != null && !formsMap.has(formId) && formsMap.size > 0))
				navigate(`/forms/${forms[0].id}`, { replace: true });
		});
	}, [ navigate, forms, formId ]);

	useEffect(() => {
		if (!formId || (form?.id === formId && submissions != null)) return;
		console.warn('getting submissions');
		executeQuery(`query($id: Int!) { form(id: $id) formSubmissions(form: $id) { id, formId, time, data, read } }`,
			{ id: formId }).then(({ form, formSubmissions }) => {
			if (form == null) return;
			setForm(JSON.parse(form));
			const submissions = formSubmissions.map((sub: any) => ({ ...sub, data: JSON.parse(sub.data) }))
				.sort((a: FormSubmission, b: FormSubmission) => (b.time - a.time));
			setSubmissions(submissions);
			console.log(submissionId);
			if (submissionId != null && !submissions.find((s: any) => s.id === submissionId))
				navigate(`/forms/${formId}`, { replace: true });
		});
	}, [ formId, submissionId, submissions, form, navigate ]);

	const submission = submissions?.find(s => s.id === submissionId) ?? null;

	function handleMarkAllRead() {
		if (!formId) return;
		if (submissions) setSubmissions(submissions?.map(s => ({ ...s, read: true })));
		if (forms) {
			const newForms = new Map(forms.entries());
			newForms.set(formId, { ...newForms.get(formId)!, unread: 0 });
			setForms(newForms);
		}
		executeQuery(`mutation($id: Int!) { markAllFormSubmissionsRead(form: $id) }`, { id: formId });
	}

	const handleMarkRead = useCallback((id: number, read: boolean) => {
		if (!formId) return;
		setSubmissions(submissions => {
			if (!submissions) return submissions;
			const newSubmissions = [ ...submissions ];
			const index = newSubmissions.findIndex(s => s.id === id);
			if (index === -1 || newSubmissions[index].read === read) return submissions;
			const offset = read ? -1 : 1;
			setForms(forms => {
				const newForms = new Map(forms!.entries() ?? []);
				newForms.set(formId!, { ...newForms.get(formId!)!, unread: newForms.get(formId!)!.unread + offset });
				return newForms;
			});
			newSubmissions[index] = { ...newSubmissions[index], read };
			executeQuery(`mutation($id: Int!, $read: Boolean!) { markFormSubmissionRead(id: $id, read: $read) }`,
				{ id: submissions[index].id, read });
			return newSubmissions;
		});
	}, [ formId ]);

	function handleClose() {
		navigate(`/forms/${formId}`);
	}

	function handleDelete() {
		handleClose();
		if (!submissions || !submissionId) return;
		const newSubmissions = [ ...submissions ];
		const index = newSubmissions.findIndex(s => s.id === submissionId);
		if (!submissions[index].read) setForms(forms => {
			const newForms = new Map(forms!.entries() ?? []);
			newForms.set(formId!, { ...newForms.get(formId!)!, unread: newForms.get(formId!)!.unread - 1 });
			return newForms;
		});
		if (index === -1) return;
		newSubmissions.splice(index, 1);
		setSubmissions(newSubmissions);
		executeQuery(`mutation($id: Int!) { deleteFormSubmission(id: $id) }`, { id: submissionId });
	}

	return (
		<div class={tw`w-full flex justify-center`}>
			<div class={tw`w-full md:w-64 h-full pl-4 flex-shrink-0 animate-fade-in`}>
				{forms && <ul class={tw`sticky top-6 flex-(& col) gap-0.5 mt-6`} role='navigation'>
					{[...forms.values()].map(form => <li key={form.id}>
						<SidebarItem icon={Icon.inbox} name={form.name} id={form.id} unread={form.unread}/>
					</li>)}
				</ul>}
			</div>
			<div class={tw`w-full max-w-4xl space-y-12 p-6 pb-16 animate-fade-in`}>
				<Card>
					<Card.Header
						icon={Icon.inbox}
						title={form?.name ?? ''}
						subtitle={form ? `${submissions?.filter(s => !s.read).length} Unread Submissions` : ''}
					>
						<Button.Secondary
							small
							label='Mark All Read'
							icon={Icon.view}
							class={tw`absolute top-6 right-6`}
							onClick={handleMarkAllRead}
						/>
					</Card.Header>
					<Card.Body class={tw`pb-0`}>
						{form && submissions && <table class={tw`table-fixed w-full text-left`}>
							<tr class={tw`text-gray-300 font-mono uppercase text-xs tracking-widest`}>
								<th class={tw`py-3 w-20 pl-6`}>ID</th>
								<th class={tw`py-3 w-28`}>Date</th>
								{form.dashboard.columns?.map(col =>
									<th class={tw`py-3 pl-8 ${col.maxWidth && `w-[${col.maxWidth}px]`}`} key={col}>{(() => {
										const field = form.fields.find(f => f.id === col.id);
										return field?.shortName || field?.label;
									})()}</th>
								)}
							</tr>
							{submissions.map(sub => <tr
								key={sub.id}
								onClick={() => navigate(`/forms/${form.id}/${sub.id}`)}
								tabIndex={0}
								class={tw`border-(t-1 gray-600) bg-gray-800 ${sub.read && 'opacity-60'}
									hocus:brightness-110 hocus:saturate-80 hocus:border-b-1 transition duration-75 cursor-pointer`}>
								<td class={tw`py-3 pl-0 font-bold tracking-wide text-sm font-mono text-gray-200`}>
									<div class={tw`flex w-full`}>
										<div class={tw`w-1.5 h-1.5 bg-accent-300 ring-([3px] accent-400) mr-3 ml-1
											-mt-0.5 self-center rounded-full shrink-0 ${sub.read && 'opacity-0'}`}/>
										<span class={tw`${!sub.read && 'text-accent-200'}`}>{sub.id}</span>
									</div>
								</td>
								<td class={tw`py-3 flex-(& col)`}>
									<span class={tw`text-sm font-medium`}>{formatDate(sub.time)}</span>
									<span class={tw`text-([10px] -mt-1 block gray-200) font-medium`}>{formatTime(sub.time)}</span>
								</td>
								{form.dashboard.columns?.map(col =>
									<td class={tw`py-3 pl-8`} key={col}>
										<RowField field={form.fields.find(f => f.id === col.id)!} data={sub.data[col.id]}/>
									</td>
								)}
							</tr>)}
						</table>}
					</Card.Body>
				</Card>
			</div>
			<div class={tw`hidden w-80 shrink 2xl:block`}/>
			<FormSubmissionModal
				key={submission?.id}
				show={!!submission}
				data={submission}
				form={form}
				onClose={handleClose}
				onDelete={handleDelete}
				onMarkRead={handleMarkRead}
			/>
		</div>
	);
}
