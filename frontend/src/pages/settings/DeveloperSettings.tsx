import { h } from 'preact';
import { useReducer, useEffect, useCallback } from 'preact/hooks';

import Card from '../../Card';
// import { SavePopup } from '../../structure';
import { Form, Annotation, Toggle } from '../../input';

import { useData, QUERY_DEVELOPER } from '../../Graph';

import icon_developer from '@res/icon/developer.svg';

export default function DeveloperSettings() {
	const [ data ] = useData([ QUERY_DEVELOPER ], []);
	// const updateData = useMutation(MUTATE_DEVELOPER);

	const [ developer, setDeveloper ] = useReducer((developer, newDeveloper: any) => ({...developer, ...newDeveloper}),
		{ watchMode: false });

	const handleReset = useCallback(() => setDeveloper({ watchMode: data.developer?.watchMode ?? false }),
		[ data.developer?.watchMode ]);

	useEffect(() => handleReset(), [ data, handleReset ]);

	// const isDirty = developer.watchMode !== data.developer?.watchMode;

	// const handleSave = () => updateData({ developer }).then(refresh);

	return (
		<Card>
			<Card.Header icon={icon_developer} title='Developer' subtitle='Settings for developers of plugins and themes.'/>
			<Card.Body>
				<Form>
					<div class='grid grid-cols-2 gap-3 pb-4'>
						<Annotation title='Watch Mode'
							description='When enabled, plugins, themes, and open pages will automatically
								refresh when their sources are changed. Do not leave on in production, as it will waste resources.'>
							<Toggle value={developer.watchMode} onValue={(watchMode: boolean) => setDeveloper({ watchMode })}/>
						</Annotation>
					</div>
					{/* <SavePopup active={isDirty} onSave={handleSave} onReset={handleReset} /> */}
				</Form>
			</Card.Body>
		</Card>
	);
}
