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
		<div class='shadow-md bg-neutral-50 dark:bg-neutral-700 rounded-lg overflow-hidden flex flex-col w-full'>
			<div class='relative w-full pb-[50%] bg-neutral-50 dark:bg-neutral-600 rounded-t border-b border-neutral-100 dark:border-neutral-600'>
				{coverPath && <img width='640' height='320' alt='' role='presentation'
					src={coverPath} class={mergeClasses('absolute inset-0 object-cover rounded-t transition w-full h-full',
						!enabled && 'filter grayscale dark:contrast-75 brightness-[300%] dark:brightness-50 mix-blend-luminosity')}/>}
			</div>

			<div class='p-3'>
				<h2 class={mergeClasses('font-medium transition', !enabled && 'text-neutral-500 dark:text-neutral-300')}>{name}</h2>
				<p class={mergeClasses('text-sm truncate transition', enabled ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400')}>
					{description}</p>
			</div>

			<div class='grid grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-600 border-t border-neutral-100 dark:border-neutral-600'>
				<Button label={enabled ? 'Disable' : 'Enable'} class='rounded-t-none rounded-r-none' onClick={onToggle}/>
				<Button label='Details' class='rounded-t-none rounded-l-none' onClick={onDetails}/>
			</div>
		</div>
	);
}
