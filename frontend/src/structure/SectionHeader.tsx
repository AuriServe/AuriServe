import { h } from 'preact';

import { merge } from 'common/util';

import Svg from '../Svg';

interface Props {
	icon: string;
	title: string;
	subtitle?: string;

	style?: any;
	class?: string;
}

export default function SectionHeader(props: Props) {
	return (
		<div class={merge('flex w-max gap-3 pb-2 icon-p-neutral-100 icon-s-neutral-300', props.class)}>
			<div
				class={merge(
					'relative rounded bg-neutral-100 dark:bg-neutral-600',
					props.subtitle ? 'p-2 w-12 h-12' : 'p-1.5 w-9 h-9'
				)}>
				<Svg size={props.subtitle ? 8 : 6} src={props.icon} />
			</div>
			<div class='flex flex-col justify-center'>
				<h2 class='font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100'>{props.title}</h2>
				{props.subtitle && <p class='text-sm text-neutral-600 dark:text-neutral-200'>{props.subtitle}</p>}
			</div>
		</div>
	);
}
