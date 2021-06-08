import * as Preact from 'preact';

import { mergeClasses } from '../Util';

interface Props {
	icon: string;
	title: string;
	subtitle?: string;
	
	style?: any;
	class?: string;
}

export default function SectionHeader(props: Props) {
	return (
		<div class={mergeClasses('flex w-max gap-3 pb-2', props.class)}>
			<div class={mergeClasses('relative rounded bg-gray-900 dark:bg-gray-200', props.subtitle ? 'p-3 w-16 h-16' : 'p-1.5 w-11 h-11')}>
				<img width={64} height={64} src={props.icon} alt='' role='presentation'
					class='dark:filter dark:invert dark:brightness-75 dark:contrast-200 dark:hue-rotate-180
						w-full h-full select-none pointer-events-none'/>
			</div>
			<div class='flex flex-col justify-center'>
				<h2 class='text-xl text-gray-50 dark:text-gray-800'>{props.title}</h2>
				{props.subtitle && <p class='font-normal text-gray-300 py-0.5'>{props.subtitle}</p>}
			</div>
		</div>
	);
}
