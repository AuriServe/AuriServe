import { useContext, useState } from 'preact/hooks';
import { h, ComponentChildren, cloneElement } from 'preact';

import Svg from '../Svg';
import Shortcut from './Shortcut';
import { Button } from '../../Main';
import Menu, { MenuContext } from './Menu';

import { tw, merge } from '../../Twind';
import { useClasses, Classes } from '../../Hooks';

import icon_arrow_more from '@res/icon/arrow_more.svg';

interface Props {
	icon?: string;
	label: string;

	children?: ComponentChildren;

	disabled?: boolean;
	onClick?: () => true | void;

	class?: Classes;
}

export default function Entry(props: Props) {
	const ctx = useContext(MenuContext);
	const classes = useClasses(props.class);
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
			shortcuts.push(cloneElement(child));
		} else {
			subEntries.push(cloneElement(child));
		}
	});

	const handleClick = () => {
		const keepAlive = props.onClick?.() ?? (subEntries.length > 0 && !props.onClick);
		if (!keepAlive) ctx.onClose?.();
	};

	console.log(props.class);

	return (
		<li
			class={merge(
				tw`flex mx-1.5 mb-0.5 first-of-type:mt-1.5 last-of-type:mb-1.5 relative
					${hover ? 'z-10' : ''}`,
				classes.get()
			)}>
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				class={tw`grow cursor-auto grid`}>
				<Button.Unstyled
					disabled={props.disabled}
					onClick={handleClick}
					class={tw`Entry~(flex px-1.5 py-1.5 items-center text-left
						gap-3 rounded transition duration-75 cursor-pointer
						hocus:(bg-accent-400/5 icon-p-white icon-s-accent-400 text-accent-100)
						icon-p-gray-100 icon-s-gray-300 text-gray-200)
						disabled:!(cursor-auto bg-transparent icon-p-gray-400 icon-s-gray-600 text-gray-300)
						${hover ? '!(bg-accent-400/5 icon-p-white icon-s-accent-400 text-accent-100)' : ''}`}>
					<Svg src={props.icon ?? ''} size={6} class={classes.get('icon')}/>
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
				</Button.Unstyled>
				{subEntries.length !== 0 && (
					<Menu
						active={hover}
						class={tw`absolute !left-full !-top-1.5 will-change-transform`}>
						{subEntries}
					</Menu>
				)}
			</div>
			{shortcuts.length !== 0 && <div class={tw`flex`}>{shortcuts}</div>}
		</li>
	);
}
