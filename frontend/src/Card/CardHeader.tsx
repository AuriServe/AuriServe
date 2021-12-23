import { h, RefObject } from 'preact';

import { merge } from 'common/util';

import Svg from '../Svg';

interface Props {
	// Any default section properties.
	[ key: string ]: any;

	/** An SVG icon's source to display in the header. */
	icon?: string;

	/** The title of the card. */
	title?: string;

	/** The subtitle of the card. */
	subtitle?: string;

	style?: any;
	class?: string;
	children?: any;
	refObj?: RefObject<HTMLDivElement>;
}

/**
 * A header for a card. Has an icon, a title, and a subtitle,
 * and optionally arbitrary children.
 */

export default function CardHeader(props: Props) {
	const passedProps = { ...props } as any;

	delete passedProps.icon;
	delete passedProps.title;
	delete passedProps.subtitle;
	delete passedProps.refObj;
	delete passedProps.children;

	return (
		<div {...passedProps} ref={props.refObj} class={merge(
			'rounded-t-lg bg-white dark:bg-neutral-750 p-4 relative', props.class)}>
			{(props.title !== undefined || props.subtitle !== undefined) &&
				<div class='flex w-max gap-3 primary-neutral-600 secondary-neutral-400
					dark:primary-neutral-100 dark:secondary-neutral-300'>
					{props.icon && <div class={merge('relative rounded bg-neutral-200 dark:bg-neutral-600',
						props.subtitle ? 'p-2 w-12 h-12' : 'p-1.5 w-9 h-9')}>
						<Svg size={props.subtitle ? 8 : 6} src={props.icon}/>
					</div>}
					<div class='flex flex-col justify-center'>
						<h2 class='font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-100'>{props.title}</h2>
						{props.subtitle && <p class='text-sm text-neutral-600 dark:text-neutral-200'>{props.subtitle}</p>}
					</div>
				</div>
			}
			{props.children}
		</div>
	);
}
