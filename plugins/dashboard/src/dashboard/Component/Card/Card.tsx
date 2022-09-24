import { h, ComponentChildren, RefObject, ComponentType } from 'preact';

import { tw, merge } from '../../Twind';

import CardBody from './CardBody';
import CardHeader from './CardHeader';
import CardToolbar from './CardToolbar';
import CardFooter from './CardFooter';
import { forwardRef } from 'preact/compat';

export interface Props {
	// Any default section properties.
	[key: string]: any;

	as?: ComponentType<any> | string;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * A card container.
 * The CardBody, CardHeader, CardToolbar, and CardFooter add extra content to the card.
 */

const cardTmp = forwardRef<HTMLElement, Props>(function Card(props, ref) {
	const Tag = props.as ?? 'section';

	const passedProps = { ...props };
	delete passedProps.as;
	delete passedProps.class;

	return (
		<Tag
			ref={ref}
			{...passedProps}
			class={merge(
				tw`Card~(block bg-(white,dark:gray-800) rounded-lg shadow-md)`,
				props.class
			)}
		/>
	);
});

const Card: typeof cardTmp & { Body: typeof CardBody; Header: typeof CardHeader; Toolbar: typeof CardToolbar; Footer: typeof CardFooter } = cardTmp as any;

Card.Body = CardBody;
Card.Header = CardHeader;
Card.Toolbar = CardToolbar;
Card.Footer = CardFooter;

export default Card;
