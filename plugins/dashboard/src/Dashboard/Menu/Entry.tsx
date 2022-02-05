import { useState } from 'preact/hooks';
import { h, ComponentChildren } from 'preact';

import Svg from '../Svg';
import Menu from './Menu';
import Shortcut from './Shortcut';

import { tw, merge } from '../twind';

import icon_arrow_more from '@res/icon/arrow_more.svg';

interface Props {
	icon?: string;
	label: string;

	class?: string;
	children?: ComponentChildren;
}

export default function Entry(props: Props) {
	const [hover, setHover] = useState<boolean>(false);

	const shortcuts: any[] = [];
	const subEntries: any[] = [];

	const children: any[] = props.children
		? Array.isArray(props.children)
			? props.children
			: [props.children]
		: [];

	children.forEach((child) => {
		if (child.type === Shortcut) {
			shortcuts.push(child);
		} else {
			subEntries.push(child);
		}
		// 	assert(!submenu, 'Menu entry can only have one submenu.');
		// 	submenu = cloneElement(child, {
		// 		class: merge(child.class, tw`absolute left-full -top-1.5`),
		// 	});
		// } else if (child.type === Shortcut) {
		// 	shortcuts.push(child);
		// } else assert(false, 'Menu entry can only have SubMenu and Shortcut children.');
	});

	return (
		<li
			class={merge(
				tw`flex mx-1.5 mb-0.5 first-of-type:mt-1.5 last-of-type:mb-1.5 ${
					hover ? 'z-10 relative' : ''
				}`,
				props.class
			)}>
			<button
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				class={tw`grow cursor-auto grid`}>
				<div
					class={tw`Entry~(flex px-1.5 py-1.5 items-center text-left
						gap-3 rounded transition duration-75 cursor-pointer
						hocus:(bg-accent-400/5 icon-p-white icon-s-accent-400 text-accent-100)
						icon-p-gray-100 icon-s-gray-300 text-gray-200)
						${hover ? '!(bg-accent-400/5 icon-p-white icon-s-accent-400 text-accent-100)' : ''}`}>
					<Svg src={props.icon ?? ''} size={6} />
					<p class={tw`grow leading-none pt-px font-medium transition duration-75`}>
						{props.label}
					</p>
					{subEntries.length !== 0 && (
						<Svg
							src={icon_arrow_more}
							class={tw`-mr-1.5 pl-4 icon-p-${hover ? 'accent-50' : 'gray-200'}`}
							size={6}
						/>
					)}
					{shortcuts.length > 0 && <div class='w-1' />}
				</div>
				{subEntries.length !== 0 && (
					<Menu
						active={hover}
						class={tw`absolute left-full -top-1.5 will-change-transform`}>
						{subEntries}
					</Menu>
				)}
			</button>
			{shortcuts.length !== 0 && <div class={tw`flex`}>{shortcuts}</div>}
		</li>
	);
}
