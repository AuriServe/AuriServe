import { cloneElement, ComponentChildren, h } from 'preact';

import Entry from './Entry';
import Header from './Header';
import Divider from './Divider';
import Shortcut from './Shortcut';

import Transition from '../Transition';
import { tw, merge } from '../../Twind';

interface Props {
	active?: boolean;

	openFrom?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

	class?: string;
	children: ComponentChildren;
}

export default function Menu(props: Props) {
	const openFrom = props.openFrom ?? 'topLeft';
	const isTop = openFrom === 'topLeft' || openFrom === 'topRight';
	const isLeft = openFrom === 'topLeft' || openFrom === 'bottomLeft';

	let children: any[] = props.children
		? Array.isArray(props.children)
			? props.children
			: [props.children]
		: [];

	children = children.map((child, i) =>
		cloneElement(child, {
			class: merge(
				child.props.class,
				tw`opacity-0 animate-${isTop ? 'drop' : 'rise'}-fade-in
				[animation-delay:${(isTop ? i + 1 : children.length - i - 1) * 25}ms]`
			),
		})
	);

	const transformOrigin = `${isLeft ? '1rem' : 'calc(100% - 1rem)'} ${
		isTop ? '1rem' : 'calc(100% - 1rem)'
	}`;

	return (
		<Transition
			as='div'
			show={props.active ?? true}
			duration={100}
			initial={true}
			enter={tw`transition duration-100`}
			enterFrom={tw`scale-95 opacity-0`}
			invertExit
			style={{ transformOrigin }}
			class={merge(
				tw`Menu~(relative isolate min-w-[12rem] w-max h-auto grid
				bg-gray-750 rounded shadow-lg shadow-black/25)`,
				props.class
			)}>
			<div
				class={tw`absolute -z-10 -top-8 -left-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)]`}
			/>
			<div class='relative flex flex-col'>{children}</div>
		</Transition>
	);
}

Menu.Entry = Entry;
Menu.Header = Header;
Menu.Divider = Divider;
Menu.Shortcut = Shortcut;

export { Entry, Header, Shortcut, Divider };
