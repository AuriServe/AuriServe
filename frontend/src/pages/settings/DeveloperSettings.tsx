import { h } from 'preact';
import { useReducer, useEffect } from 'preact/hooks';

import { SavePopup } from '../../structure';
import { Form, Annotation, Toggle } from '../../input';
import { useData, useMutation, QUERY_DEVELOPER, MUTATE_DEVELOPER } from '../../Graph';


export default function MainSettings() {
	const [ data, refresh ] = useData([ QUERY_DEVELOPER ], []);
	const updateData = useMutation(MUTATE_DEVELOPER);

	const [ developer, setDeveloper ] = useReducer((developer, newDeveloper: any) => ({...developer, ...newDeveloper}),
		{ watchMode: false });

	const handleReset = () => setDeveloper({ watchMode: data.developer?.watchMode ?? false });

	useEffect(() => handleReset(), [ data ]);

	const isDirty = developer.watchMode !== data.developer?.watchMode;

	const handleSave = () => updateData({ developer }).then(refresh);

	return (
		<Form class='w-full max-w-3xl mx-auto'>
			<div class='grid grid-cols-2 gap-3 pb-4'>
				<Annotation title='Watch Mode'
					description='When enabled, plugins, themes, and open pages will automatically
						refresh when their sources are changed. Do not leave on in production, as it will waste resources.'>
					<Toggle value={developer.watchMode} onValue={(watchMode: boolean) => setDeveloper({ watchMode })}/>
				</Annotation>
			</div>
			<SavePopup active={isDirty} onSave={handleSave} onReset={handleReset} />
		</Form>
	);
}
