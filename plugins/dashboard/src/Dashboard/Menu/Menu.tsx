import { cloneElement, ComponentChildren, h } from 'preact';

import Entry from './Entry';
import Header from './Header';
import Shortcut from './Shortcut';
import SubMenu from './SubMenu';
import Divider from './Divider';

import { tw, merge } from '../twind';
import Transition from '../Transition';

interface Props {
	active?: boolean;

	class?: string;
	children: ComponentChildren;
}

export default function Menu(props: Props) {
	let children: any[] = props.children
		? Array.isArray(props.children)
			? props.children
			: [props.children]
		: [];

	children = children.map((child, i) =>
		cloneElement(child, {
			class: merge(
				child.props.class,
				tw`opacity-0 animate-drop-fade-in [animation-delay:${(i + 1) * 25}ms]`
			),
		})
	);

	return (
		<Transition
			as='div'
			show={props.active ?? true}
			duration={100}
			initial={true}
			enter={tw`transition duration-100 [transform-origin:1rem_1rem]`}
			enterFrom={tw`scale-95 opacity-0`}
			invertExit
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
Menu.Shortcut = Shortcut;
Menu.SubMenu = SubMenu;
Menu.Divider = Divider;

export { Entry, Header, Shortcut, SubMenu, Divider };
