import { h } from 'preact';
import FlipMove from 'react-flip-move';
import { useState, useEffect } from 'preact/hooks';

import { Plugin } from 'common/graph/type';

import Svg from '../../Svg';
import Card from '../../Card';
import PluginItem from './FeatureItem';
import { SavePopup } from '../../structure';
import { Tertiary as Button } from '../../Button';

import { useData, executeQuery, QUERY_PLUGINS, MUTATE_PLUGINS } from '../../Graph';

import icon_target from '@res/icon/target.svg';
import icon_browse from '@res/icon/browse.svg';
import icon_plugins from '@res/icon/plugin.svg';

const sortFn = (a: Plugin, b: Plugin) => {
	if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
	return a.identifier < b.identifier ? -1 : 1;
};

export default function PluginsSettings() {
	const [data, refresh] = useData(QUERY_PLUGINS, []);

	const [plugins, setPlugins] = useState<Plugin[]>((data.plugins ?? []).sort(sortFn));
	useEffect(() => setPlugins((data.plugins ?? []).sort(sortFn)), [data.plugins]);

	const isDirty =
		JSON.stringify(
			(data.plugins ?? []).map((t: Plugin) => (t.enabled ? t.identifier : ''))
		) !== JSON.stringify(plugins.map((t) => (t.enabled ? t.identifier : '')));

	const handleToggle = (toggle: string) => {
		const newPlugins: Plugin[] = JSON.parse(JSON.stringify(plugins));
		const plugin = newPlugins.filter((t) => t.identifier === toggle)[0];
		if (plugin) plugin.enabled = !plugin.enabled;
		setPlugins(newPlugins);
	};

	const handleSave = async () => {
		executeQuery(MUTATE_PLUGINS, {
			enabled: plugins.filter((t) => t.enabled).map((t) => t.identifier),
		}).then(() => refresh());
	};

	return (
		<Card>
			<Card.Header
				icon={icon_plugins}
				title='Plugins'
				subtitle='Manage site functionality.'>
				<Button
					class='absolute bottom-4 right-4'
					icon={icon_browse}
					label='Browse Plugins'
					small
				/>
			</Card.Header>
			<Card.Body>
				{plugins.length !== 0 && (
					<FlipMove className='grid grid-cols-3 gap-4' duration={250} aria-role='list'>
						{plugins.map((plugin) => (
							<li class='list-none' key={plugin.identifier}>
								<PluginItem
									{...plugin}
									onToggle={() => handleToggle(plugin.identifier)}
									onDetails={() => console.log('deets')}
								/>
							</li>
						))}
					</FlipMove>
				)}
				{!plugins.length && (
					<div class='flex py-28 justify-center items-center gap-2'>
						<Svg src={icon_target} size={6} />
						<p class='leading-none mt-px text-neutral-200 font-medium interact-none'>
							No plugins found.
						</p>
					</div>
				)}
				<SavePopup
					active={isDirty}
					onSave={handleSave}
					onReset={() => setPlugins((data.plugins ?? []).sort(sortFn))}
				/>
			</Card.Body>
		</Card>
	);
}
