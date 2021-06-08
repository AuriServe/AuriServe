import * as Preact from 'preact';
import FlipMove from 'react-flip-move';
import { useState, useEffect } from 'preact/hooks';

import { Plugin } from 'common/graph/type';

import { Label } from '../../input';
import PluginItem from './FeatureItem';
import { SavePopup } from '../../structure';
import { useQuery, useMutation, QUERY_PLUGINS, MUTATE_PLUGINS } from '../../Graph';

const sortFn = (a: Plugin, b: Plugin) => {
	if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
	else return a.identifier < b.identifier ? -1 : 1;
};

export default function PluginsSettings() {
	const [ data ] = useQuery(QUERY_PLUGINS);
	const updateEnabled = useMutation(MUTATE_PLUGINS);

	const [ plugins, setPlugins ] = useState<Plugin[]>((data.plugins ?? []).sort(sortFn));
	useEffect(() => setPlugins((data.plugins ?? []).sort(sortFn)), [ data.plugins ]);

	const isDirty = JSON.stringify((data.plugins ?? []).map((t: Plugin) => t.enabled ? t.identifier : '')) !==
		JSON.stringify(plugins.map(t => t.enabled ? t.identifier : ''));

	const handleToggle = (toggle: string) => {
		const newPlugins: Plugin[] = JSON.parse(JSON.stringify(plugins));
		const plugin = newPlugins.filter(t => t.identifier === toggle)[0];
		if (plugin) plugin.enabled = !plugin.enabled;
		setPlugins(newPlugins);
	};

	const handleSave = async () => updateEnabled({ enabled: plugins.filter(t => t.enabled).map(t => t.identifier) });
	
	return (
		<div class='w-full max-w-5xl mx-auto'>
			<Label label='Plugins' class='!text-lg dark:!text-gray-800'/>
			{plugins.length !== 0 && <FlipMove className='grid grid-cols-3 gap-3' duration={250} aria-role='list'>
				{plugins.map(plugin => <li class='list-none' key={plugin.identifier}>
					<PluginItem {...plugin}
						onToggle={() => handleToggle(plugin.identifier)}
						onDetails={() => console.log('deets')}/>
				</li>)}
			</FlipMove>}
			{!plugins.length && <p>No plugins</p>}
			<SavePopup active={isDirty} onSave={handleSave} onReset={() => setPlugins((data.plugins ?? []).sort(sortFn))} />
		</div>
	);
}
