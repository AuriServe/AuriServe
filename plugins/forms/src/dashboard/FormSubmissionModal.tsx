import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import { Modal, Card, Icon, Button, tw } from 'dashboard';

import { Form } from '../Type';
import { Components } from './field';
import Message from '../common/Message';
import { FormSubmission } from './FormSubmissionsPage';

interface Props {
	show: boolean;
	form: Form | null;
	data: FormSubmission | null;

	onClose: () => void;
	onDelete: () => void;
	onMarkRead: (id: number, read: boolean) => void;
}

export default function FormSubmissionModal(props: Props) {
	const [ data, setData ] = useState<FormSubmission>(null as any as FormSubmission);
	if (data !== props.data && props.data) setData(props.data!);
	const form = props.form as Form;

	// const onMarkRead = props.onMarkRead;
	// useEffect(() => {
	// 	if (data?.id == null) return;
	// 	onMarkRead(data.id, true);
	// }, [ data?.id, onMarkRead ]);

	if (!data) return null;

	function handleReply() {
		const elem = document.createElement('template');
		render(h(Message, {
			form,
			time: props.data!.time,
			domain: location.host,
			submissionId: props.data!.id,
			data: props.data!.data
		}), elem);

		const link = document.createElement('a');
		link.href = `mailto:${data.data[form.dashboard.reply!]}?subject=${
			encodeURIComponent(`Re: ${form.name} Form Submission.`)}&html-part=${encodeURIComponent(elem.children[0].innerHTML)}`;
		link.click();
		props.onMarkRead(data.id, true);
	}

	return (
		<Modal active={props.show} onClose={props.onClose}>
			<Card class={tw`w-screen max-w-3xl`}>
				<Card.Header
					icon={Icon.receipt}
					title={`Form Submission ${data?.id ?? 0}`}
					subtitle={`Submitted on ${new Date(data?.time ?? 0).toLocaleDateString('en-US',
						{ month: 'short', day: 'numeric', year: 'numeric' })} at ${
							new Date(data?.time ?? 0).toLocaleTimeString('en-US',
								{ hour12: true, hour: 'numeric', minute: 'numeric' })}.`}>
					<div class={tw`flex-(& row-reverse) gap-2 absolute top-6 right-6`}>
						{form.dashboard.reply && <Button.Secondary label='Reply' icon={Icon.receipt} small
							onClick={handleReply}/>}
						<Button.Tertiary label='Delete' icon={Icon.trash} small
							onClick={props.onDelete}/>
						<Button.Tertiary label={data.read ? 'Mark Unread' : 'Mark Read'} icon={Icon.view} small
							onClick={() => props.onMarkRead(data.id, !data.read)}/>
					</div>
				</Card.Header>
				<Card.Body class={tw`grid-(& cols-[repeat(${form.dashboard.layoutColumns},1fr)]) gap-4`}>
					{form.dashboard.layout.map((layout) =>
						<div key={layout.id} class={tw`grid overflow-hidden`} style={{
							gridColumnStart: layout.col,
							gridRowStart: layout.row,
							gridColumnEnd: layout.colSpan && `span ${layout.colSpan}`,
							gridRowEnd: layout.rowSpan && `span ${layout.rowSpan}`}}>
							{(() => {
								switch (layout.id) {
									default: {
										const field = form.fields.find(field => field.id === layout.id);
										if (!field) return <p>UNKNOWN FIELD {layout.id}</p>;
										const Component = Components[(field.type ?? "text")];
										return <Component layout={layout} field={field} value={data.data[field.id]} />;
									}
									case "#space": {
										return null;
									}
								}
							})()}
						</div>
						)}
				</Card.Body>
			</Card>
		</Modal>
	)
}
