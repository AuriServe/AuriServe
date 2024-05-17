import { cloneElement, ComponentChildren, createContext, h } from 'preact';

import Entry from './Entry';
import Header from './Header';
import Divider from './Divider';
import Shortcut from './Shortcut';

import Transition from '../Transition';
import { tw, merge } from '../../Twind';
import { elementBounds } from '../../Util';
import { Classes, useClasses } from '../../Hooks';
import { useContext, useLayoutEffect, useState } from 'preact/hooks';

interface Props {
	active?: boolean;
	onClose?: () => void;

	openFrom?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
	position?: { top: number; left: number };
	offset?: number;
	for?: HTMLElement | null;

	class?: Classes;
	children: ComponentChildren;
}

interface MenuContextData {
	root?: boolean;
	onClose?: (evt?: MouseEvent) => void;
}

export const MenuContext = createContext<MenuContextData>({ root: true });

export default function Menu(props: Props) {
	const ctx = useContext(MenuContext);
	const classes = useClasses(props.class);

	const openFrom = props.openFrom ?? 'topLeft';
	const isTop = openFrom === 'topLeft' || openFrom === 'topRight';
	const isLeft = openFrom === 'topLeft' || openFrom === 'bottomLeft';

	const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

	useLayoutEffect(() => {
		if (!props.active) return;
		const bounds = props.for && elementBounds(props.for);

		if (bounds) {
			setPosition({
				top: bounds.top + bounds.height + (props.offset ?? 8),
				left: bounds.left,
			});
		} else if (props.position) {
			setPosition({
				top: props.position.top,
				left: props.position.left,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.for, props.offset, props.position?.top, props.position?.left, props.active]);

	let children: any[] = props.children
		? Array.isArray(props.children)
			? props.children
			: [props.children]
		: [];

	children = children.filter(Boolean).map((child, i) => {
		const newClasses = tw`animate-${isTop ? 'drop' : 'rise'}-fade-in
			[animation-delay:${(isTop ? i + 1 : children.length - i - 1) * 25}ms]`;

		const mergedClasses = (child.props.class == null || typeof child.props.class === 'string')
			? ({ '': merge(child.props.class, newClasses) })
			: ({
				...child.props.class,
				'': merge(child.props.class['.'] ?? child.props.class[''] ?? '', newClasses),
			});
		delete mergedClasses['.'];

		return cloneElement(child, { class: mergedClasses });
	});

	const transformOrigin = `${isLeft ? '1rem' : 'calc(100% - 1rem)'} ${isTop ? '1rem' : 'calc(100% - 1rem)'}`;

	const handleClose = (evt?: MouseEvent) => {
		evt?.preventDefault();
		evt?.stopPropagation();

		props.onClose?.();
	};

	return (
		<Transition
			as='div'
			show={props.active ?? true}
			duration={100}
			initial={true}
			enter={tw`transition duration-100 pointer-events-none`}
			enterFrom={tw`scale-95 opacity-0`}
			invertExit
			style={{ transformOrigin, ...position }}
			class={merge(tw`Menu~(absolute isolate w-auto h-auto grid z-50)`, 'MENU', classes.get())}>
			<div
				class={ctx.root
					? tw`fixed inset-0 -z-10 w-full h-full`
					: tw`absolute -z-10 -top-8 left-1.5 w-[calc(100%+1.5rem)] h-[calc(100%+4rem)]`}
				onClick={handleClose}
				onContextMenu={handleClose}
			/>

			<div
				class={merge(
					tw`Menu~(min-w-[12rem] w-max h-auto grid bg-gray-750 rounded shadow-lg shadow-black/25)
					${ctx.root && 'will-change-transform'}`, classes.get('card'))}
				onContextMenu={(evt) => {
					evt.preventDefault();
					evt.stopPropagation();
				}}>
				<div
					class={tw`block w-1 h-1 z-10 absolute`}
					onClick={handleClose}
					onContextMenu={handleClose}
				/>
				<MenuContext.Provider
					value={{ root: false, onClose: ctx.onClose ?? handleClose }}>
					{children}
				</MenuContext.Provider>
			</div>
		</Transition>
	);
}

Menu.Entry = Entry;
Menu.Header = Header;
Menu.Divider = Divider;
Menu.Shortcut = Shortcut;

export { Entry, Header, Shortcut, Divider };
