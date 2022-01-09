import { h, ComponentChildren, RefObject, ComponentType } from 'preact';

import { tw, merge } from '../twind';

import CardBody from './CardBody';
import CardHeader from './CardHeader';
import CardToolbar from './CardToolbar';
import CardFooter from './CardFooter';

export interface Props {
	// Any default section properties.
	[key: string]: any;

	as?: ComponentType<any> | string;

	style?: any;
	class?: string;
	children?: ComponentChildren;
	refObj?: RefObject<HTMLDivElement>;
}

/**
 * A card container.
 * The CardBody, CardHeader, CardToolbar, and CardFooter add extra content to the card.
 */

function Card(props: Props) {
	const Tag = props.as ?? 'section';
	return (
		<Tag
			{...props}
			ref={props.refObj}
			class={merge(tw`block bg-{white,dark:gray-800} rounded-lg shadow-md`, props.class)}
		/>
	);
}

Card.Body = CardBody;
Card.Header = CardHeader;
Card.Toolbar = CardToolbar;
Card.Footer = CardFooter;

export default Card;
