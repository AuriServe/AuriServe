// import { h } from 'preact';
// import { useState, useEffect } from 'preact/hooks';

// import { Plugin } from 'common/graph/type';

// import Svg from '../../Svg';
// import Card from '../../Card';
// import PluginItem from './FeatureItem';
// // import { SavePopup } from '../../structure';
// import { TertiaryButton } from '../../Button';

// import { useData, /*executeQuery,*/ QUERY_PLUGINS /*MUTATE_PLUGINS*/ } from '../../Graph';

// import { tw } from '../../twind';

// import icon_target from '@res/icon/target.svg';
// import icon_browse from '@res/icon/browse.svg';
// import icon_plugins from '@res/icon/plugin.svg';

// const sortFn = (a: Plugin, b: Plugin) => {
// 	if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
// 	return a.identifier < b.identifier ? -1 : 1;
// };

// export default function PluginsSettings() {
// 	const [data] = useData(QUERY_PLUGINS, []);

// 	const [plugins, setPlugins] = useState<Plugin[]>((data.plugins ?? []).sort(sortFn));
// 	useEffect(() => setPlugins((data.plugins ?? []).sort(sortFn)), [data.plugins]);

// 	// const isDirty =
// 	// 	JSON.stringify(
// 	// 		(data.plugins ?? []).map((t: Plugin) => (t.enabled ? t.identifier : ''))
// 	// 	) !== JSON.stringify(plugins.map((t) => (t.enabled ? t.identifier : '')));

// 	const handleToggle = (toggle: string) => {
// 		const newPlugins: Plugin[] = JSON.parse(JSON.stringify(plugins));
// 		const plugin = newPlugins.filter((t) => t.identifier === toggle)[0];
// 		if (plugin) plugin.enabled = !plugin.enabled;
// 		setPlugins(newPlugins);
// 	};

// 	// const handleSave = async () => {
// 	// 	executeQuery(MUTATE_PLUGINS, {
// 	// 		enabled: plugins.filter((t) => t.enabled).map((t) => t.identifier),
// 	// 	}).then(() => refresh());
// 	// };

// 	return (
// 		<Card>
// 			<Card.Header
// 				icon={icon_plugins}
// 				title='Plugins'
// 				subtitle='Manage site functionality.'>
// 				<TertiaryButton
// 					class={tw`absolute bottom-4 right-4`}
// 					icon={icon_browse}
// 					label='Browse Plugins'
// 					small
// 				/>
// 			</Card.Header>
// 			<Card.Body>
// 				{plugins.length !== 0 && (
// 					<div className={tw`grid grid-cols-3 gap-4`}>
// 						{plugins.map((plugin) => (
// 							<li class={tw`list-none`} key={plugin.identifier}>
// 								<PluginItem
// 									{...plugin}
// 									onToggle={() => handleToggle(plugin.identifier)}
// 									onDetails={() => console.log('deets')}
// 								/>
// 							</li>
// 						))}
// 					</div>
// 				)}
// 				{!plugins.length && (
// 					<div class={tw`flex py-28 justify-center items-center gap-2`}>
// 						<Svg src={icon_target} size={6} />
// 						<p class={tw`leading-none mt-px text-gray-200 font-medium interact-none`}>
// 							No plugins found.
// 						</p>
// 					</div>
// 				)}
// 			</Card.Body>
// 		</Card>
// 	);
// }
