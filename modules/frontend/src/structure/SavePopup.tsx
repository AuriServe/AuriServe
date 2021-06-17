import * as Preact from 'preact';

import Card from './Card';
import Button from './Button';

import { mergeClasses } from '../Util';

interface Props {
	active: boolean;

	onReset: () => void;
	onSave: () => void;
}

export default function SavePopup({ active, onReset, onSave }: Props) {
	return (
		<div class={mergeClasses('bg-gradient-to-t from-gray-900 to-transparent pointer-events-none',
			'dark:from-gray-50 fixed left-14 bottom-0 right-0 transition transform',
			!active && 'opacity-0 translate-y-3')}>
			<Card class={mergeClasses('flex w-max !p-2 gap-3 mt-8 mb-3 items-center shadow-xl', active && 'pointer-events-auto')}>
				<img class='ml-2 w-6 h-6 dark:filter dark:invert dark:brightness-[60%] dark:contrast-200 dark:hue-rotate-180'
					width={24} height={24} src='/admin/asset/icon/save-dark.svg' alt='' role='presentation'/>
				<p class='pr-4 text-gray-200 dark:text-gray-800'>You have unsaved changes.</p>

				<div class='flex flex-row-reverse gap-2'>
					<Button class='px-2 py-1' type='submit' onClick={onSave} label='Save'/>
					<Button class='px-1 py-1 text-gray-400 dark:text-gray-600 !bg-transparent !border-transparent' onClick={onReset} label='Reset'/>
				</div>
			</Card>
		</div>
	);
}
