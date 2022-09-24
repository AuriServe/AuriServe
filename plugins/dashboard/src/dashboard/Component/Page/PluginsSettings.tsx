import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Svg from '../Svg';
import Card from '../Card';
import Modal from '../Modal';
import Button from '../Button';
import SavePrompt from '../SavePrompt';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';
import { QUERY_PLUGINS, useData, GraphData } from '../../Graph';

type Plugin = GraphData['plugins'][0];

function sortPlugins(a: Plugin, b: Plugin) {
	return (+b.enabled - +a.enabled) || a.name.localeCompare(b.name);
}

function getDependentPlugins(plugins: Plugin[], plugin: Plugin) {
	const newDependents = [ plugin ];
	const dependents = [];

	while (newDependents.length) {
		const dependent = newDependents.pop()!;

		for (const plugin of plugins) {
			if (plugin.depends.findIndex(({ identifier }) => identifier === dependent.identifier) !== -1) {
				if (dependents.findIndex(({ identifier }) => identifier === plugin.identifier) === -1) {
					newDependents.push(plugin);
					dependents.push(plugin);
				}
			}
		}
	}

	return dependents.sort(sortPlugins);
}

function getDependencyPlugins(plugins: Plugin[], plugin: Plugin) {
	const newDependencies = [ plugin ];
	const dependencies = [];

	while (newDependencies.length) {
		const dependent = newDependencies.pop()!;

		for (const dependency of dependent.depends) {
			if (dependencies.findIndex(({ identifier }) => identifier === dependency.identifier) === -1) {
				const plugin = plugins.find(({ identifier }) => identifier === dependency.identifier);
				newDependencies.push(plugin!);
				dependencies.push(plugin!);
			}
		}
	}

	return dependencies.sort(sortPlugins);
}

function PluginThumbnail({ plugin, class: className, large = false }:
	{ plugin: Plugin, class?: string, large?: boolean }) {
	return (
		<div class={tw`aspect-video rounded-md bg-gray-500/25 grid place-content-center ${className}`}>
			<Svg src={plugin.icon ? (Icon as any)[plugin.icon] : (plugin.type === 'library' ? Icon.library : Icon.plugin)}
				size={large ? 12 : 8}/>
		</div>
	)
}

function SidebarPluginList({ plugins, label }: { plugins: Plugin[], label: string }) {
	return (
		<Fragment>
			<p class={tw`mt-6 text-(xs gray-300) font-bold uppercase tracking-widest`}>{label}</p>
			<ul class={tw`flex-(& col) gap-1.5 mt-2`}>
				{plugins.length > 0
					? plugins.map(({ identifier, version, name, icon, type, enabled }) => <li key={identifier}
						class={tw`${enabled && 'bg-gray-input'} border-(2 gray-${enabled ? 'input' : '700'}) rounded flex gap-1`}>
						<Svg src={icon ? (Icon as any)[icon] : (type === 'library' ? Icon.library : Icon.plugin)}
							size={6} class={tw`p-1.5 m-1 bg-gray-${enabled ? '600' : '700'} rounded`}/>
						<div class={tw`flex-(& col)`}>
							<p class={tw`text-gray-${enabled ? '100' : '200'} mt-0.5 -mb-0.5`}>{name}</p>
							<p class={tw`text-(xs gray-${enabled ? '300' : '300'}) font-bold`}>{version}</p>
						</div>
					</li>)
					: <div class={tw`border-(2 gray-700 dashed) rounded flex gap-1
						text-gray-300 h-12 items-center justify-center`}>
						No {label}.
					</div>
				}
			</ul>
		</Fragment>
	)
}

export default function PluginsSettings() {
	const [ { plugins: dataPlugins = [] } ] = useData(QUERY_PLUGINS, []);
	const [ plugins, setPlugins ] = useState<Plugin[]>([]);
	useEffect(() => setPlugins(JSON.parse(JSON.stringify(dataPlugins)).sort(sortPlugins)), [ dataPlugins ]);

	const dirty = plugins.findIndex(({ enabled, identifier }) => enabled !==
		dataPlugins.find(p => p.identifier === identifier)!.enabled) !== -1;

	const [ hovered, setHovered ] = useState<string | null>('');
	const [ confirmToggle, setConfirmToggle ] = useState<boolean>(false);

	const hoveredPlugin = (hovered != null && plugins.find(plugin => plugin.identifier === hovered)) || null;

	const hoveredDependents = plugins
		.filter(({ depends }) => depends.findIndex(({ identifier }) => identifier === hoveredPlugin?.identifier) !== -1);
	const hoveredEnabledDependents = (hoveredPlugin ? getDependentPlugins(plugins, hoveredPlugin) : [])
		.filter(({ enabled }) => enabled);

	const hoveredDependencies = (hoveredPlugin?.depends ?? [])
		.map(dependency => plugins.find(plugin => plugin.identifier === dependency.identifier)!).sort(sortPlugins);
	const hoveredDisabledDependencies = (hoveredPlugin ? getDependencyPlugins(plugins, hoveredPlugin) : [])
		.filter(plugin => !plugin.enabled);

	function handleToggle(identifier: string) {
		const plugin = plugins.find(plugin => plugin.identifier === identifier)!;
		if (plugin.enabled) {
			plugin.enabled = false;
			for (const dependant of getDependentPlugins(plugins, plugin)) dependant.enabled = false;
			setPlugins([...plugins].sort(sortPlugins));
		}
		else {
			plugin.enabled = true;
			for (const dependant of getDependencyPlugins(plugins, plugin)) dependant.enabled = true;
			setPlugins([...plugins].sort(sortPlugins));
		}
	}

	function handleSave() {
		window.location.reload();
	}

	function handleUndo() {
		setPlugins(JSON.parse(JSON.stringify(dataPlugins)).sort(sortPlugins));
	}

	const ToggleButton = hoveredPlugin?.enabled ? Button.Secondary : Button.Tertiary;

	const numPlugins = plugins.length;
	const numEnabledPlugins = plugins.filter(({ enabled }) => enabled).length;

	return (
		<Card class={tw`relative`}>
			<Card.Header
				icon={Icon.plugin}
				title='Plugins'
				subtitle={`${numPlugins} plugin${numPlugins !== 1 ? 's' : ''}, ${numEnabledPlugins} enabled.`}
			/>
			<Card.Body>
				<ul>
					{plugins.map(plugin => <li key={plugin.identifier}
						class={tw`relative flex gap-3 p-2 rounded ${hovered === plugin.identifier && 'bg-gray-input'}`}
						onMouseEnter={() => setHovered(plugin.identifier)}>
						<PluginThumbnail plugin={plugin} class={tw`w-32`}/>
						<div class={tw`flex-(& col)`}>
							<p>
								<span class={tw`font-medium ${!plugin.enabled && 'text-gray-200'}`}>{plugin.name}</span> &nbsp;{' '}
								<span class={tw`text-(gray-300 xs) font-bold`}>{plugin.version}</span>
							</p>
							<p class={tw`text-(sm gray-${plugin.enabled ? '200' : '300'})`}>{plugin.description}</p>
							<p class={tw`text-(xs) font-bold uppercase tracking-widest leading-none mt-3
								${plugin.enabled ? 'text-accent-300' : 'text-gray-300'}`}>
								{plugin.enabled ? 'Enabled' : 'Disabled'}
							</p>
						</div>
					</li>)}
				</ul>
			</Card.Body>
			{hoveredPlugin && <div class={tw`absolute w-80 left-[calc(100%+24px)] top-0 bottom-0 animate-fade-in`}>
				<Card key={hoveredPlugin.identifier}
					class={tw`sticky w-full top-6 animate-fade-in`}>
					<Card.Body class={tw`flex-(& col)`}>
						<PluginThumbnail plugin={hoveredPlugin} large/>

						<div class={tw`flex gap-2 mt-3`}>
							<ToggleButton size={10}
								icon={hoveredPlugin.enabled ? Icon.check : Icon.close_circle}
								label={` ${hoveredPlugin.enabled ? 'Enabled' : 'Disabled'}`} class={tw`grow`}
								onClick={() => setConfirmToggle(true)}/>
							<Button.Tertiary size={10} icon={Icon.options} label='Options' iconOnly/>
						</div>

						<div class={tw`flex gap-3.5 mt-6`}>
							<Svg src={hoveredPlugin.icon ? (Icon as any)[hoveredPlugin.icon] :
								hoveredPlugin.type === 'library' ? Icon.library : Icon.plugin}
								size={6} class={tw`p-1.5 bg-gray-600 rounded shrink-0`}/>
							<div class={tw`flex-(& col)`}>
								<p class={tw`leading-none`}>
									<span class={tw`font-medium`}>{hoveredPlugin.name}</span> &nbsp;{' '}
									<span class={tw`text-(gray-300 xs) font-bold`}>{hoveredPlugin.version}</span>
								</p>
								<p class={tw`text-(sm gray-200) mt-1`}>{hoveredPlugin.description}</p>
							</div>
						</div>

						<SidebarPluginList plugins={hoveredDependencies} label='dependencies'/>

						<SidebarPluginList plugins={hoveredDependents} label='dependents'/>
					</Card.Body>
				</Card>
			</div>}

			<Modal active={confirmToggle && (hoveredPlugin?.enabled ?? false)} onClose={() => setConfirmToggle(false)}>
				<Card>
					<Card.Body class={tw`flex gap-6 p-6 w-full max-w-xl`}>
						<Svg src={hoveredPlugin?.icon ? (Icon as any)[hoveredPlugin!.icon] :
							(hoveredPlugin?.type === 'library' ? Icon.library : Icon.plugin)} size={8}
							class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-100 icon-s-gray-300`}/>
						<div>
							<p class={tw`text-lg font-medium text-gray-100`}>Disable {hoveredPlugin?.name}?</p>

							{hoveredEnabledDependents.length > 0
								? <Fragment>
									<p class={tw`text-gray-200`}>This will disable the following plugins which depend on it:</p>

									<ul class={tw`flex-(& row) flex-wrap gap-1.5 pt-4`}>
										{hoveredEnabledDependents.map(plugin =>
											<li key={plugin.identifier} class={tw`bg-gray-input rounded p-1.5 flex gap-2`}>
												<Svg src={plugin.icon ? (Icon as any)[plugin.icon] :
													(plugin.type === 'library' ? Icon.library : Icon.plugin)} size={6}/>
												<p class={tw`pt-px font-medium pr-1`}>{plugin.name}</p>
											</li>
										)}
									</ul>
								</Fragment>
								: <p class={tw`text-gray-200`}>No enabled plugins depend on this plugin.</p>}
						</div>
					</Card.Body>
					<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg`}>
						<Button.Secondary icon={Icon.close_circle} label='Disable'
							onClick={() => (handleToggle(hovered!), setConfirmToggle(false))}/>
						<Button.Tertiary icon={Icon.arrow_circle_left} label='Cancel'
							onClick={() => setConfirmToggle(false)}/>
					</div>
				</Card>
			</Modal>

			<Modal active={confirmToggle && (!hoveredPlugin?.enabled ?? false)} onClose={() => setConfirmToggle(false)}>
				<Card>
					<Card.Body class={tw`flex gap-6 p-6 w-full max-w-xl`}>
						<Svg src={hoveredPlugin?.icon ? (Icon as any)[hoveredPlugin!.icon] :
							(hoveredPlugin?.type === 'library' ? Icon.library : Icon.plugin)} size={8}
							class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-100 icon-s-gray-300`}/>
						<div>
							<p class={tw`text-lg font-medium text-gray-100`}>Enable {hoveredPlugin?.name}?</p>

							{hoveredDisabledDependencies.length > 0
								? <Fragment>
									<p class={tw`text-gray-200`}>This will enable the following dependency plugins:</p>

									<ul class={tw`flex-(& row) flex-wrap gap-1.5 pt-4`}>
										{hoveredDisabledDependencies.map(plugin =>
											<li key={plugin.identifier} class={tw`bg-gray-input rounded p-1.5 flex gap-2`}>
												<Svg src={plugin.icon ? (Icon as any)[plugin.icon] :
													(plugin.type === 'library' ? Icon.library : Icon.plugin)} size={6}/>
												<p class={tw`pt-px font-medium pr-1`}>{plugin.name}</p>
											</li>
										)}
									</ul>
								</Fragment>
								: <p class={tw`text-gray-200`}>This plugin has no disabled dependencies.</p>}
						</div>
					</Card.Body>
					<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg`}>
						<Button.Secondary icon={Icon.check} label='Enable'
							onClick={() => (handleToggle(hovered!), setConfirmToggle(false))}/>
						<Button.Tertiary icon={Icon.arrow_circle_left} label='Cancel'
							onClick={() => setConfirmToggle(false)}/>
					</div>
				</Card>
			</Modal>

			<SavePrompt saving={false} dirty={dirty} onSave={handleSave} onUndo={handleUndo}/>
		</Card>
	);
}
