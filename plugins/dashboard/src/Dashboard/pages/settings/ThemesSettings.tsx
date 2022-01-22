import { h } from 'preact';
// import FlipMove from 'react-flip-move';
import { useState, useEffect } from 'preact/hooks';

import { Theme } from 'common/graph/type';

import Svg from '../../Svg';
import Card from '../../Card';
import ThemeItem from './FeatureItem';
import { Tertiary as Button } from '../../Button';

import { useData, /*executeQuery,*/ QUERY_THEMES /*MUTATE_THEMES*/ } from '../../Graph';

import icon_theme from '@res/icon/theme.svg';
import icon_target from '@res/icon/target.svg';
import icon_browse from '@res/icon/browse.svg';

const sortFn = (a: Theme, b: Theme) => {
	if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
	return a.identifier < b.identifier ? -1 : 1;
};

export default function ThemesSettings() {
	const [data] = useData(QUERY_THEMES, []);

	const [themes, setThemes] = useState<Theme[]>((data.themes ?? []).sort(sortFn));
	useEffect(() => setThemes((data.themes ?? []).sort(sortFn)), [data.themes]);

	// const isDirty =
	// 	JSON.stringify(
	// 		(data.themes ?? []).map((t: Theme) => (t.enabled ? t.identifier : ''))
	// 	) !== JSON.stringify(themes.map((t) => (t.enabled ? t.identifier : '')));

	const handleToggle = (toggle: string) => {
		const newThemes: Theme[] = JSON.parse(JSON.stringify(themes));
		const theme = newThemes.filter((t) => t.identifier === toggle)[0];
		if (theme) theme.enabled = !theme.enabled;
		setThemes(newThemes);
	};

	// const handleSave = async () => {
	// 	executeQuery(MUTATE_THEMES, {
	// 		enabled: themes.filter((t) => t.enabled).map((t) => t.identifier),
	// 	}).then(() => refresh());
	// };

	return (
		<Card>
			<Card.Header
				icon={icon_theme}
				title='Themes'
				subtitle={"Manage your site's appearance."}>
				<Button
					class='absolute bottom-4 right-4'
					icon={icon_browse}
					label='Browse Themes'
					small
				/>
			</Card.Header>
			<Card.Body>
				{themes.length !== 0 && (
					<div class='grid grid-cols-3 gap-4' aria-role='list'>
						{themes.map((theme) => (
							<li class='list-none' key={theme.identifier}>
								<ThemeItem
									{...theme}
									onToggle={() => handleToggle(theme.identifier)}
									onDetails={() => console.log('deets')}
								/>
							</li>
						))}
					</div>
				)}
				{!themes.length && (
					<div class='flex py-28 justify-center items-center gap-2'>
						<Svg src={icon_target} size={6} />
						<p class='leading-none mt-px text-neutral-200 font-medium interact-none'>
							No themes found.
						</p>
					</div>
				)}
				{/* <SavePopup
					active={isDirty}
					onSave={handleSave}
					onReset={() => setThemes((data.themes ?? []).sort(sortFn))}
				/> */}
			</Card.Body>
		</Card>
	);
}
