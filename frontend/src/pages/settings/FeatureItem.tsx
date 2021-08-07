import { h } from 'preact';

import { mergeClasses } from 'common/util';

import { Button } from '../../structure';

interface Props {
	name: string;
	coverPath?: string;
	description: string;

	enabled: boolean;

	onToggle: () => void;
	onDetails: () => void;
}

export default function FeatureItem({ coverPath, name, description, enabled, onDetails, onToggle }: Props) {
	return (
		<div class='shadow-md bg-gray-900 dark:bg-gray-200 rounded flex flex-col w-full border border-gray-800 dark:border-gray-300'>
			<div class='relative w-full pb-[50%] bg-gray-900 dark:bg-gray-300 rounded-t border-b border-gray-800 dark:border-gray-300'>
				{coverPath && <img width='640' height='320' alt='' role='presentation'
					src={coverPath} class={mergeClasses('absolute inset-0 object-cover rounded-t transition w-full h-full',
						!enabled && 'filter grayscale dark:contrast-75 brightness-[300%] dark:brightness-50 mix-blend-luminosity')}/>}
			</div>

			<div class='p-3'>
				<h2 class={mergeClasses('font-medium transition', !enabled && 'text-gray-400 dark:text-gray-600')}>{name}</h2>
				<p class={mergeClasses('text-sm truncate transition', enabled ? 'text-gray-200 dark:text-gray-700' : 'text-gray-500')}>
					{description}</p>
			</div>

			<div class='grid grid-cols-2 gap-px bg-gray-800 dark:bg-gray-300 border-t border-gray-800 dark:border-gray-300'>
				<Button label={enabled ? 'Disable' : 'Enable'} class='rounded-t-none rounded-r-none' onClick={onToggle}/>
				<Button label='Details' class='rounded-t-none rounded-l-none' onClick={onDetails}/>
			</div>
		</div>
	);
}
