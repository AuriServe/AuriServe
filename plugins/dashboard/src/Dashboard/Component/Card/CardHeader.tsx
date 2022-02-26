import { h, RefObject } from 'preact';

import { tw, merge } from '../../Twind';

import Svg from '../Svg';

interface Props {
	// Any default section properties.
	[key: string]: any;

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
		<div
			{...passedProps}
			ref={props.refObj}
			class={merge(
				tw`CardHeader~(relative p-4 rounded-t-lg bg-(white, dark:gray-750))`,
				props.class
			)}>
			{(props.title !== undefined || props.subtitle !== undefined) && (
				<div
					class={tw`flex w-max gap-3 icon-p-gray-(600 dark:100) icon-s-gray-(400 dark:300)`}>
					{props.icon && (
						<div
							class={tw`relative rounded bg-gray-(200 dark:600)
							${props.subtitle ? 'p-2 w-12 h-12' : 'p-1.5 w-9 h-9'}`}>
							<Svg size={props.subtitle ? 8 : 6} src={props.icon} />
						</div>
					)}
					<div class={tw`flex-(& col) gap-1.5 justify-center`}>
						<h2 class={tw`font-medium leading-none text-lg text-gray-(800 dark:100)`}>
							{props.title}
						</h2>
						{props.subtitle && (
							<p class={tw`leading-none text-(sm gray-(600 dark:200))`}>
								{props.subtitle}
							</p>
						)}
					</div>
				</div>
			)}
			{props.children}
		</div>
	);
}
