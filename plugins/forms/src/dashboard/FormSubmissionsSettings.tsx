import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Card, Icon, Svg, Modal, tw, Button, useData, executeQuery } from 'dashboard';

interface FormDropdownProps {
	name: string;
	icon: string;
	data: Record<string, string>[];
	onDelete: (id: number) => void;
}

const QUERY_CONTACT_FORM_SUBMISSIONS = `contactFormSubmissions { id, read, name, email, municipality, message }`;
const QUERY_UNSUBSCRIBE_FORM_SUBMISSIONS = `unsubscribeFormSubmissions { id, read, email }`;

const MUTATION_CONTACT_FORM_SUBMISSION_DELETE = `
	query ContactFormSubmissionDelete($id: Int!) { deleteContactFormSubmission(id: $id) }`;

const MUTATION_UNSUBSCRIBE_FORM_SUBMISSION_DELETE = `
	query ContactFormSubmissionDelete($id: Int!) { deleteUnsubscribeFormSubmission(id: $id) }`;


function FormDropdown(props: FormDropdownProps) {
	const [ selected, setSelected ] = useState<number | null>(null);

	const unread = props.data.find(({ read }) => !read) != null;

	function handleReply(ind: number) {
		const url = `mailto:${props.data[ind].email
			}?subject='Re:%20Aurailus%20Design%20Tax%20Calculator%20Contact%20Form&body=${
			encodeURIComponent(`Thanks for your time,<br>- Nicole Collings<br>Aurailus Design<hr/><strong>Original Message:</strong><br>${props.data[ind].message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')}`)}`;
		window.open(url);
	}

	function handleDelete(ind: number) {
		props.onDelete(props.data[ind].id as any as number);
	}

	return (
		<details class={tw`rounded bg-gray-750 open:bg-gray-700 transition-colors`} open={unread}>
			<summary class={tw`flex gap-2 p-2 font-bold list-none rounded select-none cursor-pointer`}>
				<Svg size={6} src={props.icon}/>
				<p class={tw`pt-px`}>{props.name}</p>
			</summary>
			<ul class={tw`border-(t-2 gray-600) py-2`}>
				{props.data.map((submission, i) => <li key={i}>
					<div class={tw`w-full gap-2 flex items-center`}>
						<button
							onClick={() => setSelected(i)}
							class={tw`p-2 pl-10 text-left w-full grid grid-cols-${Object.keys(props.data[0] || {}).length - 1} gap-4`}>
							{Object.keys(submission).filter(key => key !== 'id' && key !== 'read').map((column, i, arr) =>
								<p key={column}
									class={tw`text-(sm gray-100/75) font-bold truncate ${i === arr.length - 1 && 'col-span-2'}`}>
									{submission[column]}
								</p>
							)}
						</button>
						<div class={tw`shrink-0 flex gap-2 p-2 pr-4`}>
							<Button.Secondary icon={Icon.edit} iconOnly small label='Reply' onClick={() => handleReply(i)}/>
							<Button.Tertiary icon={Icon.trash} iconOnly small label='Delete' onClick={() => handleDelete(i)}/>
						</div>
					</div>
				</li>)}
			</ul>
			<Modal active={selected != null} onClose={() => setSelected(null)}>
				{selected != null && <Card class={tw`w-screen max-w-xl`}>
					<Card.Header icon={Icon.inbox} title='Form Submission'/>
					<Card.Body class={tw`flex-(& col) gap-4`}>

						{Object.keys(props.data[selected]).filter(key => key !== 'id' && key !== 'read').map(column =>
							<div key={column} class={tw`flex-(& col) gap-1`}>
								<p class={tw`text-xs font-bold uppercase tracking-widest text-gray-200`}>{column}</p>
								<p>{props.data[selected][column]}</p>
							</div>
						)}
					</Card.Body>
				</Card>}
			</Modal>
		</details>
	)

}

export default function FormSubmissionsSettings() {
	const [ { contactFormSubmissions = [], unsubscribeFormSubmissions = [] }, update ] =
		useData([ QUERY_CONTACT_FORM_SUBMISSIONS, QUERY_UNSUBSCRIBE_FORM_SUBMISSIONS ], []) as any;

	const unread = contactFormSubmissions.filter((s: any) => !s.read).length +
		unsubscribeFormSubmissions.filter((s: any) => !s.read).length;

	function handleDeleteContact(id: number) {
		executeQuery(MUTATION_CONTACT_FORM_SUBMISSION_DELETE, { id }).then(() => update());
	}

	function handleDeleteUnsubscribe(id: number) {
		executeQuery(MUTATION_UNSUBSCRIBE_FORM_SUBMISSION_DELETE, { id }).then(() => update());
	}

	return (
		<Card>
			<Card.Header title="Form Submissions" subtitle={`${unread} Unread Submissions.`} icon={Icon.inbox}/>
			<Card.Body>
				<li class={tw`flex-(& col) gap-4`}>
					<ul>
						<FormDropdown
							name="Contact Requests"
							icon={Icon.star}
							data={contactFormSubmissions}
							onDelete={handleDeleteContact}/>
						</ul>
					<ul>
						<FormDropdown
							name="Unsubscriptions"
							icon={Icon.trash}
							data={unsubscribeFormSubmissions}
							onDelete={handleDeleteUnsubscribe}/>
						</ul>
				</li>
			</Card.Body>
		</Card>
	);
}
