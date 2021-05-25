import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Plugin } from 'as_common/graph/interface';

import SavePopup from '../../SavePopup';
import { Label } from '../../input/Input';
import { useQuery, useMutation, QUERY_PLUGINS, MUTATE_PLUGINS } from '../../Graph';

import './PluginsSettings.sass';

function PluginItem({ plugin, active, onClick }: { plugin: Plugin; active: boolean; onClick: () => any }) {
	return (
		<li class='PluginsSettings-PluginItemWrap' key={plugin.identifier}>
			<button class='PluginsSettings-PluginItem' onClick={onClick}>
				<div class='PluginsSettings-PluginItem-Cover'>
					{plugin.coverPath && <img src={'/admin/plugins/cover/' + plugin.identifier + '.jpg'} alt=''/>}
					<span class={'PluginsSettings-PluginItem-Tag ' + (active ? 'Enabled' : 'Disabled')}>
						{active ? 'Enabled' : 'Disabled'}
					</span>
				</div>

				<div class='PluginsSettings-PluginItem-Content'>
					<h2 class='PluginsSettings-PluginItem-Title'>{plugin.name}</h2>
					<p class='PluginsSettings-PluginItem-Author'>{plugin.author}</p>
					<p class='PluginsSettings-PluginItem-Description'>{plugin.description}</p>
				</div>
			</button>
		</li>
	);
}

export default function PluginsSettings() {
	const [ data ] = useQuery(QUERY_PLUGINS);
	const updateEnabled = useMutation(MUTATE_PLUGINS);

	const [ plugins, setPlugins ] = useState<Plugin[]>(data.plugins ?? []);
	useEffect(() => setPlugins(data.plugins ?? []), [ data.plugins ]);

	const enabled = plugins.filter(p => p.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
	const disabled = plugins.filter(p => !p.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
	const isDirty = JSON.stringify((data.plugins ?? []).map(p => p.enabled)) !== JSON.stringify(plugins.map(p => p.enabled));

	const handleToggle = (toggle: string) => {
		const newplugins: Plugin[] = JSON.parse(JSON.stringify(plugins));
		const theme = newplugins.filter(p => p.identifier === toggle)[0];
		if (theme) theme.enabled = !theme.enabled;
		setPlugins(newplugins.sort((a, b) => a.identifier < b.identifier ? -1 : 1));
	};

	const handleSave = async () => updateEnabled({ enabled: enabled.map(p => p.identifier) });

	return (
		<div class='Settings PluginsSettings'>
			<Label label='Enabled Plugins' />
			<ul class='PluginsSettings-PluginsList'>
				{enabled.map((plugin) => <PluginItem plugin={plugin} active={true}  onClick={() => handleToggle(plugin.identifier)}/>)}
				{!enabled.length && <div class='PluginsSettings-PluginsListEmpty'>
					<h2>No enabled plugins.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<Label label='Disabled Plugins' />
			<ul class='PluginsSettings-PluginsList'>
				{disabled.map((plugin) => <PluginItem plugin={plugin} active={false} onClick={() => handleToggle(plugin.identifier)}/>)}
				{!disabled.length && <div class='PluginsSettings-PluginsListEmpty'>
					<h2>No disabled plugins.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<SavePopup active={isDirty} onSave={handleSave} onReset={() => setPlugins(data.plugins ?? [])} />
		</div>
	);
}
