import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { tw, Icon, Card, executeQuery, useLocation, useNavigate, Button } from 'dashboard';

import SidebarItem from './SidebarItem';
import { ClientFieldProps, Form } from '../Type';
import { DatabaseFormSubmission } from '../server/Database';

type FormSubmission = Omit<DatabaseFormSubmission, 'read' | 'data'> & { data: Record<string, any>, read: boolean };

function RowData({ field, data }: { field: ClientFieldProps, data: any }) {
	switch (field.type) {
		case 'text':
		case 'textarea':
		case 'tel':
		case 'email': {
			return <span class={tw`font-medium text-gray-100 text-sm line-clamp-1
				overflow-ellipsis max-w-full block whitespace-pre overflow-hidden max-w-full`}>{data}</span>
		}
		case 'select': {
			const selected = field.multiple ? data : [ data ];
			return <div class={tw`flex gap-1 overflow-hidden relative isolate`}>
				<div class={tw`absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-r from-transparent to-gray-800`} />
				{selected.map((d: string) => {
					const option = field.options.find(o => o.id === d);
					return <span key={d} class={tw`bg-gray-700 rounded text-xs
						text-gray-100 font-bold px-2 py-1 whitespace-pre`}>
						{option?.shortName ?? option?.label ?? d}
					</span>
				})}
			</div>;
		}
		default:
			return <p>UNKNOWN</p>
	}
}

export default function FormSubmissionsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [ forms, setForms ] = useState<Map<number, { id: number, name: string, unread: number }> | null>(null);
	const [ form, setForm ] = useState<Form | null>(null);
	const [ submissions, setSubmissions ] = useState<FormSubmission[] | null>(null);

	useEffect(() => {
		if (forms?.size) return;
		executeQuery('{ forms { id, path, name, unread } }').then(({ forms }) => {
			setForms(new Map(forms.map((f: any) => ([ f.id, f ]))));
			if (forms.length > 0) navigate(`/forms/${forms[0].id}`, { replace: true });
		});
	}, [ navigate, forms ]);


	let formId: number | null = parseInt(location.pathname.replace(/\/forms\/?/, ''), 10);
	if (isNaN(formId) || !forms?.has(formId)) formId = null;

	useEffect(() => {
		if (!formId) return;
		executeQuery(`query($id: Int!) { form(id: $id) formSubmissions(form: $id) { id, formId, time, data, read } }`,
			{ id: formId }).then(({ form, formSubmissions }) => {

			if (form == null) return;
			setForm(JSON.parse(form));
			setSubmissions(formSubmissions.map((sub: any) => ({ ...sub, data: JSON.parse(sub.data) }))
				.sort((a: FormSubmission, b: FormSubmission) => (b.time - a.time)));
		});
	}, [ formId ]);

	function handleMarkAllRead() {
		if (!formId) return;
		if (submissions) setSubmissions(submissions?.map(s => ({ ...s, read: true })));
		// executeQuery(`mutation($id: Int!) { markAllFormSubmissionsRead(form: $id) }`, { id: formId }).then(() => {
		// 	setSubmissions(submissions?.map(s => ({ ...s, read: true })));
		// 	setForms(new Map(forms?.set(formId, { ...forms.get(formId), unread: 0 })));
		// });
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
							{submissions.map(sub => <tr key={sub.id} class={tw`border-(t-1 gray-600)`}>
								<td class={tw`py-3 pl-0 font-bold tracking-wide text-sm font-mono text-gray-200`}>
									<div class={tw`flex w-full`}>
										<div class={tw`w-1.5 h-1.5 bg-accent-300 ring-([3px] accent-400) mr-3 ml-1
											-mt-0.5 self-center rounded-full shrink-0 ${sub.read && 'opacity-0'}`}/>
										<span class={tw`${!sub.read && 'text-accent-200'}`}>{sub.id}</span>
									</div>
								</td>
								<td class={tw`py-3 flex-(& col)`}>
									<span class={tw`text-sm font-medium`}>{new Date(sub.time).toLocaleDateString('en-US',
										{ month: 'short', day: 'numeric', year: 'numeric' })}</span>
									<span class={tw`text-([10px] -mt-1 block gray-200) font-medium`}>
										{new Date(sub.time).toLocaleTimeString('en-US',
										{ hour12: true, hour: 'numeric', minute: 'numeric' })}</span>
								</td>
								{form.dashboard.columns?.map(col =>
									<td class={tw`py-3 pl-8`} key={col}>
										<RowData field={form.fields.find(f => f.id === col.id)!} data={sub.data[col.id]}/>
									</td>
								)}
							</tr>)}
						</table>}
					</Card.Body>
				</Card>
			</div>
			<div class={tw`hidden w-80 shrink 2xl:block`}/>
		</div>
	);
}
