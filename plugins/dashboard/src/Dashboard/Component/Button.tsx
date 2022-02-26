import { NavLink } from 'react-router-dom';
import { forwardRef } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import Svg from './Svg';

import { tw, merge } from '../Twind';

const SIZES = {
	large: 10,
	small: 8,
};

export interface Props {
	// Other attributes to be put on the container.
	[key: string]: any;

	label?: string;
	icon?: string;

	small?: boolean; // Shorthand to `size: small`
	size?: number | keyof typeof SIZES;
	rounded?: boolean;
	iconOnly?: boolean;
	iconRight?: boolean;

	to?: string;
	href?: string;
	onClick?: () => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export const UnstyledButton = forwardRef<HTMLElement, Props>(function UnstyledButton(
	props,
	ref
) {
	const Tag: any = props.to ? NavLink : props.href ? 'a' : 'button';
	const passedProps = { ...props };

	delete passedProps.label;
	delete passedProps.icon;
	delete passedProps.iconOnly;
	delete passedProps.iconRight;
	delete passedProps.small;
	delete passedProps.size;
	delete passedProps.rounded;
	delete passedProps.class;

	return (
		<Tag
			ref={ref}
			{...passedProps}
			className={props.class}
			target={Tag === 'a' ? '_blank' : undefined}
			rel={Tag === 'a' ? 'noreferrer noopener' : undefined}
		/>
	);
});

const BaseButton = forwardRef<HTMLElement, Props>(function BaseButton(props, ref) {
	const size =
		(typeof props.size === 'number'
			? props.size
			: SIZES[props.size || props.small ? 'small' : 'large']) * 4;
	const paddingThreshold = size < 40 ? (props.rounded ? 24 : 28) : 32;

	const style = {
		...props.style,
		height: size,
		width: props.iconOnly ? size : undefined,
		paddingLeft: props.iconOnly ? undefined : size - paddingThreshold,
		paddingRight: props.iconOnly ? undefined : size - paddingThreshold,
	};

	return (
		<UnstyledButton
			ref={ref}
			{...props}
			style={style}
			class={merge(
				tw`group BaseButton~(flex w-max items-center justify-center font-bold uppercase tracking-widest
				select-none !outline-none transition-all shadow-(none hocus:md active:none)
				ring-(0 focus:& active:& offset-(active:2 focus:2) dark:offset-gray-750))
				rounded${props.rounded && '-full'}`,
				props.class
			)}>
			{props.children}
			{props.icon && !props.iconRight && <Svg src={props.icon} size={6} />}
			{props.label && (
				<span
					class={tw`text-xs mt-px -mb-px ${props.iconOnly && 'sr-only'}`}
					style={
						props.icon
							? {
									paddingLeft: size - paddingThreshold,
									paddingRight: size < 48 ? 4 : 0,
							  }
							: {}
					}>
					{props.label}
				</span>
			)}
			{props.icon && props.iconRight && <Svg src={props.icon} size={6} />}
		</UnstyledButton>
	);
});

export const PrimaryButton = forwardRef<HTMLElement, Props>(function PrimaryButton(
	props,
	ref
) {
	return (
		<BaseButton
			ref={ref}
			{...props}
			class={merge(
				tw`PrimaryButton~(bg-accent-((600 dark:600) hocus:(700 dark:500) active:(900 dark:700))
				text-(white hocus:(accent-100 dark:white) active:(accent-200 dark:accent-100))
				icon-p-(white active:(accent-300 dark:white))
				icon-s-(accent-300 active:(accent-500 dark:accent-300))
				ring-accent-((300 dark:800/75) active:400))`,
				props.class
			)}
		/>
	);
});

export const SecondaryButton = forwardRef<HTMLElement, Props>(function SecondaryButton(
	props,
	ref
) {
	return (
		<BaseButton
			ref={ref}
			{...props}
			class={merge(
				tw`SecondaryButton~(bg-accent-((200 dark:500/30) hocus:(600 dark:500/40) active:(900 dark:500/25))
				text-accent-((900 dark:100) hocus:100 active:(200 dark:200)) dark:hocus:text-white
				icon-p-accent-(900 dark:100 hocus:100 active:200) icon-s-accent-(400 dark:400 hocus:300 active:400)
				ring-accent-((300 dark:500/20) active:(400 dark:500/20)))`,
				props.class
			)}
		/>
	);
});

export const TertiaryButton = forwardRef<HTMLElement, Props>(function TertiaryButton(
	props,
	ref
) {
	return (
		<BaseButton
			ref={ref}
			{...props}
			class={merge(
				tw`TertiaryButton~(bg-gray-((200 dark:600) hocus:(300 dark:500) active:(500 dark:600))
				text-gray-((600 dark:100) hocus:(300 dark:50) active:(100 dark:200))
				icon-p-gray-(600 dark:100 active:100) icon-s-gray-(500 dark:300 active:300)
				ring-gray-((300 dark:600) active:(400 dark:600)))`,
				props.class
			)}
		/>
	);
});

export const LinkButton = forwardRef<HTMLElement, Props>(function LinkButton(props, ref) {
	return (
		<UnstyledButton
			ref={ref}
			{...props}
			class={merge(
				tw`group LinkButton~(relative isolate inline !outline-none leading-none
				icon-p-(accent-700 active:white dark:(accent-200 hocus:white active:gray-700)
				icon-s-(accent-400 active:accent-200 dark:(accent-400 hocus:accent-200 active:gray-900)))
				${props.icon && 'ml-0.5'}`,
				props.class
			)}>
			<div
				class={tw`absolute z-10 rounded-sm transition-all ease-out
				w-(full group-hocus:[calc(100% + 8px)] group-active:[calc(100% + 8px)])
				bottom-(px group-hocus:-0.5 group-active:-0.5) left-(0 group-hocus:-1 group-active:-1)
				h-(1 group-hocus:[calc(100% + 6px)] group-active:[calc(100% + 6px)])
				bg-accent-((500/30 dark:400/25) group-hocus:(500/20 dark:500/20) group-active:(500 dark:500))`}
			/>

			{props.icon && !props.iconRight && (
				<Svg
					src={props.icon}
					size={5}
					class={tw`relative z-10 inline-block -mb-1 -mt-1 -mx-0.5`}
				/>
			)}

			<span
				class={tw`z-10 font-medium
					text-(accent-(700 dark:300) group-hocus:(accent-600 dark:white) group-active:(white dark:gray-800))
					${
						props.iconOnly
							? 'sr-only'
							: `${props.icon ? (props.iconRight ? 'mr-1' : 'ml-1') : ''} relative`
					}`}>
				{props.label}
			</span>

			{props.icon && props.iconRight && (
				<Svg
					src={props.icon}
					size={5}
					class={tw`relative z-10 inline-block -mb-1 -mt-1 -mx-0.5`}
				/>
			)}
		</UnstyledButton>
	);
});

const obj: {
	Primary: typeof PrimaryButton;
	Secondary: typeof SecondaryButton;
	Tertiary: typeof TertiaryButton;
	Link: typeof LinkButton;
	Unstyled: typeof UnstyledButton;
} = {
	Primary: PrimaryButton,
	Secondary: SecondaryButton,
	Tertiary: TertiaryButton,
	Link: LinkButton,
	Unstyled: UnstyledButton,
};

export default obj;
