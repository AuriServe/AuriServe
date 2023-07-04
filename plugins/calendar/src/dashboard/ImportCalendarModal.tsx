import { titleCase } from 'common';
import { Button, Card, Field, Form, Icon, Modal, Spinner, Svg, Transition, tw } from 'dashboard';
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface Props {
	/** An identifier -> name map of existing calendars. */
	calendars: Map<number, string>;

	/** An function called once a calendar gets uploaded. Resolves when the outer component has refreshed its data. */
	onUpload: (id: number, name: string) => Promise<void>;
}

export default function ImportCalendarModal(props: Props) {
	const [ file, setFile ] = useState<File | null>(null);
	const [ showHint, setShowHint ] = useState<boolean>(false);
	const [ state, setState ] = useState<null | 'input' | 'pending' | 'success' | 'error'>(null);
	const [ formData, setFormData ] = useState<{ as: 'new' | 'existing', asTmp: string, name: string | null }>(
		{ as: 'new', asTmp: 'new', name: null });

	useEffect(() => {
		if (file) return;

		let leaveTimeout = 0;

		function onDragOver(evt: DragEvent) {
			if (evt.dataTransfer?.items?.[0]?.type === 'text/calendar') {
				if (leaveTimeout) clearTimeout(leaveTimeout);
				leaveTimeout = 0;
				evt.preventDefault();
				setShowHint(true);
			}
		};

		function onDragLeave() {
			if (leaveTimeout) clearTimeout(leaveTimeout);
			leaveTimeout = setTimeout(() => setShowHint(false), 100) as any as number;
		};

		function onDrop(evt: DragEvent) {
			evt.preventDefault();
			setShowHint(false);
			if (!evt.dataTransfer?.files?.length) return;
			const file = evt.dataTransfer.files[0];
			if (file.type !== 'text/calendar' || !file.name.endsWith('.ics')) return;
			setFile(file);
			setState('input');
			setFormData({ as: 'new', asTmp: 'new', name: titleCase(file.name.replace(/.ics$/, '')) });
		};

		document.body.addEventListener('drop', onDrop);
		document.body.addEventListener('dragover', onDragOver);
		document.body.addEventListener('dragleave', onDragLeave);

		return () => {
			document.body.removeEventListener('drop', onDrop);
			document.body.removeEventListener('dragover', onDragOver);
			document.body.removeEventListener('dragleave', onDragLeave);
		};
	}, [ file ]);

	function handleImportAsChange(as: string | null) {
		setTimeout(() => {
			if (as === 'new') setFormData({ as, asTmp: as, name: titleCase(file!.name.replace(/.ics$/, '')) });
			else if (as === 'existing') setFormData({ as, asTmp: as, name: props.calendars.keys().next().value ?? null });
		});
	}

	function handleClose() {
		setState(null);
		setFile(null);
	}

	async function handleImport() {
		setState('pending');

		const form = new FormData();
		form.append('calendar', file!);
		form.append('name', formData.name!);

		const res = await fetch('/dashboard/calendar/import',
			{ method: 'POST', body: form, headers: { token: localStorage.getItem('token')! } });

		if (!res.ok) {
			setState('error');
			return;
		}

		const id = Number.parseInt(await res.text(), 10);
		await props.onUpload(id, formData.name!);

		setState('success');
		console.log(id);


		// const reader = new FileReader();
		// reader.readAsDataURL(file!);
		// const calendar = await new Promise((res) => reader.onload = () => res(reader.result));

		// const res = await executeQuery(`mutation($name: String!, $calendar: String!)
		// 	{ calendar { importCalendar(name: $name, calendar: $calendar) } }`,
		// 	{ name: formData.name, calendar });

		// console.log(res);
	}

	return (
		<Fragment>
			<Transition
				show={showHint}
				duration={150}
				invertExit
				enter={tw`will-change-transform transition duration-150`}
				enterFrom={tw`opacity-0`}
				enterTo={tw`opacity-100`}>
				<div
					class={tw`absolute inset-0 left-14 dark:bg-[#081024cc] backdrop-filter animate-drop-fade-in
						backdrop-blur-md flex items-center justify-center z-50 flex-(& col) justify-center items-center gap-2`}>
					<Svg src={Icon.upload} size={12} class={tw`p-6 bg-gray-800 rounded-lg mb-4 interact-none`} />
					<p class={tw`leading-none text-xl text-gray-100 font-medium interact-none`}>Drop a Calendar file here to import it.</p>
					<p class={tw`text-gray-200 interact-none`}>You can also press 'New Calendar' in the sidebar.</p>
				</div>
			</Transition>

			<Modal active={state != null} onClose={handleClose}>
				{state != null && <Form value={formData} onChange={setFormData as any} onSubmit={handleImport}>
					<Card>
						<Card.Body class={tw`w-screen max-w-xl p-0`}>
							{state !== 'success' && <Fragment>
								<div class={tw`flex gap-6 p-6 pb-0`}>
									<Svg src={Icon.calendar} size={8}
										class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-200 icon-s-gray-300`}/>
									<div class={tw`w-full`}>
										<p class={tw`text-lg font-medium text-gray-100 -mt-0.5`}>Import Calendar</p>
										<p class={tw`text-gray-200`}>All of this calendar's events will be imported into AuriServe.</p>
									</div>
								</div>

								{state === 'input' && <div class={tw`pl-24 pb-8 pt-6 pr-6`}>
									<div class={tw`flex gap-4 mt-4`}>
										<Field.Option
											path='asTmp'
											label='Import Events Into'
											options={new Map([ [ 'new', 'New Calendar' ], [ 'existing', 'Existing Calendar' ] ])}
											onChange={handleImportAsChange}
											disabled={props.calendars.size < 1}
										/>

										{formData.as === 'new' && <Field.Text
											path='name'
											label='New Calendar Name'
										/>}

										{formData.as === 'existing' && <Field.Option
											path='name'
											label='Existing Calendar'
											options={props.calendars}
											disabled={props.calendars.size < 2}
										/>}
									</div>
								</div>}
								{state === 'pending' && <div class={tw`h-32 flex items-center justify-center animate-fade-in`}>
									<Spinner/>
								</div>}
								<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg`}>
									<Button.Secondary disabled={state === 'pending'}
										type='submit' icon={Icon.upload} label='Import'/>
									<Button.Tertiary disabled={state === 'pending'}
										onClick={handleClose} icon={Icon.arrow_circle_left} label='Cancel'/>
								</div>
							</Fragment>}

							{state === 'success' && <div class={tw`flex-(& col) items-center py-8 animate-rise-fade-in`}>
								<div class={tw`w-min h-min rounded bg-gray-700 p-7 my-4`}>
									<Svg src={Icon.check} size={11} class={tw`icon-p-gray-100 icon-s-gray-400`}/>
								</div>
								<p class={tw`text-(lg gray-200) font-medium`}>Import Successful</p>
								<Button.Secondary class={tw`mb-2 mt-8`} label='Continue' onClick={handleClose}/>
							</div>}
						</Card.Body>
					</Card>
				</Form>}
			</Modal>
		</Fragment>
	);
}
