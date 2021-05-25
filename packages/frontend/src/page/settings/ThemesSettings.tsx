import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Theme } from 'common/graph/type';

import SavePopup from '../../SavePopup';
import { Label } from '../../input/Input';
import { useQuery, useMutation, QUERY_THEMES, MUTATE_THEMES } from '../../Graph';

import './ThemesSettings.sass';

function ThemeItem({ theme, active, onClick }: { theme: Theme; active: boolean; onClick: () => any }) {
	return (
		<li class='ThemesSettings-ThemeItemWrap' key={theme.identifier}>
			<button class='ThemesSettings-ThemeItem' onClick={onClick}>
				<div class='ThemesSettings-ThemeItem-Cover'>
					{theme.coverPath && <img src={'/admin/themes/cover/' + theme.identifier + '.jpg'} alt=''/>}
					<span class={'ThemesSettings-ThemeItem-Tag ' + (active ? 'Enabled' : 'Disabled')}>
						{active ? 'Enabled' : 'Disabled'}
					</span>
				</div>

				<div class='ThemesSettings-ThemeItem-Content'>
					<h2 class='ThemesSettings-ThemeItem-Title'>{theme.name}</h2>
					<p class='ThemesSettings-ThemeItem-Author'>{theme.author}</p>
					<p class='ThemesSettings-ThemeItem-Description'>{theme.description}</p>
				</div>
			</button>
		</li>
	);
}

export default function ThemesSettings() {
	const [ data ] = useQuery(QUERY_THEMES);
	const updateEnabled = useMutation(MUTATE_THEMES);

	const [ themes, setThemes ] = useState<Theme[]>(data.themes ?? []);
	useEffect(() => setThemes(data.themes ?? []), [ data.themes ]);

	const enabled = themes.filter(t => t.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
	const disabled = themes.filter(t => !t.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
	const isDirty = JSON.stringify((data.themes ?? []).map(t => t.enabled)) !== JSON.stringify(themes.map(t => t.enabled));

	const handleToggle = (toggle: string) => {
		const newThemes: Theme[] = JSON.parse(JSON.stringify(themes));
		const theme = newThemes.filter(t => t.identifier === toggle)[0];
		if (theme) theme.enabled = !theme.enabled;
		setThemes(newThemes.sort((a, b) => a.identifier < b.identifier ? -1 : 1));
	};

	const handleSave = async () => updateEnabled({ enabled: enabled.map(t => t.identifier) });
	
	return (
		<div class='Settings ThemesSettings'>
			<Label label='Enabled Themes' />
			<ul class='ThemesSettings-ThemesList'>
				{enabled.map((theme) => <ThemeItem theme={theme} active={true} onClick={() => handleToggle(theme.identifier)}/>)}
				{!enabled.length && <div class='ThemesSettings-ThemesListEmpty'>
					<h2>No enabled themes.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>
			
			<Label label='Disabled Themes' />
			<ul class='ThemesSettings-ThemesList'>
				{disabled.map((theme) => <ThemeItem theme={theme} active={false} onClick={() => handleToggle(theme.identifier)} />)}
				{!disabled.length && <div class='ThemesSettings-ThemesListEmpty'>
					<h2>No disabled themes.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<SavePopup active={isDirty} onSave={handleSave} onReset={() => setThemes(data.themes ?? [])} />
		</div>
	);
}
