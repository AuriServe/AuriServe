import { h } from 'preact';

import Card from './Card';
import Button from './Button';

import { merge } from 'common/util';

interface Props {
	active: boolean;

	onReset: () => void;
	onSave: () => void;
}

export default function SavePopup({ active, onReset, onSave }: Props) {
	return (
		<div class={merge('bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none',
			'dark:from-neutral-900 fixed left-14 bottom-0 right-0 transition transform',
			!active && 'opacity-0 translate-y-3')}>
			<Card class={merge('flex w-max !p-2 gap-3 mt-8 mb-3 items-center shadow-xl', active && 'pointer-events-auto')}>
				<img width={24} height={24} src='/admin/asset/icon/save-dark.svg' alt='' role='presentation'
					class='ml-2 w-6 h-6 dark:filter dark:invert dark:brightness-[60%] dark:contrast-200 dark:hue-rotate-180'/>
				<p class='pr-4 text-neutral-700 dark:text-neutral-100'>You have unsaved changes.</p>

				<div class='flex flex-row-reverse gap-2'>
					<Button class='px-2 py-1' type='submit' onClick={onSave} label='Save'/>
					<Button class='px-1 py-1 text-neutral-500 dark:text-neutral-300
						!bg-transparent !border-transparent' onClick={onReset} label='Reset'/>
				</div>
			</Card>
		</div>
	);
}
