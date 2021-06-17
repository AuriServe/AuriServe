import * as Preact from 'preact';
import FlipMove from 'react-flip-move';
import { useState, useEffect } from 'preact/hooks';

import { Theme } from 'common/graph/type';

import { Label } from '../../input';
import ThemeItem from './FeatureItem';
import { SavePopup } from '../../structure';
import { useData, useMutation, QUERY_THEMES, MUTATE_THEMES } from '../../Graph';

const sortFn = (a: Theme, b: Theme) => {
	if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
	else return a.identifier < b.identifier ? -1 : 1;
};

export default function ThemesSettings() {
	const [ data, refresh ] = useData(QUERY_THEMES, []);
	const updateEnabled = useMutation(MUTATE_THEMES);

	const [ themes, setThemes ] = useState<Theme[]>((data.themes ?? []).sort(sortFn));
	useEffect(() => setThemes((data.themes ?? []).sort(sortFn)), [ data.themes ]);


	const isDirty = JSON.stringify((data.themes ?? []).map((t: Theme) => t.enabled ? t.identifier : '')) !==
		JSON.stringify(themes.map(t => t.enabled ? t.identifier : ''));

	const handleToggle = (toggle: string) => {
		const newThemes: Theme[] = JSON.parse(JSON.stringify(themes));
		const theme = newThemes.filter(t => t.identifier === toggle)[0];
		if (theme) theme.enabled = !theme.enabled;
		setThemes(newThemes);
	};

	const handleSave = async () =>
		updateEnabled({ enabled: themes.filter(t => t.enabled).map(t => t.identifier) }).then(() => refresh());
	
	return (
		<div class='w-full max-w-5xl mx-auto'>
			<Label label='Themes' class='!text-lg dark:!text-gray-800'/>
			{themes.length !== 0 && <FlipMove className='grid grid-cols-3 gap-3' duration={250} aria-role='list'>
				{themes.map(theme => <li class='list-none' key={theme.identifier}>
					<ThemeItem {...theme}
						onToggle={() => handleToggle(theme.identifier)}
						onDetails={() => console.log('deets')}/>
				</li>)}
			</FlipMove>}
			{!themes.length && <p>No themes</p>}
			<SavePopup active={isDirty} onSave={handleSave} onReset={() => setThemes((data.themes ?? []).sort(sortFn))} />
		</div>
	);
}
