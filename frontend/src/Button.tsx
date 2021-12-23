import { NavLink } from 'react-router-dom';
import { h, ComponentChildren } from 'preact';

import Svg from './Svg';

import { merge } from 'common/util';

const SIZES = {
	large: 10,
	small: 8
};

export interface Props {
	// Other attributes to be put on the container.
	[ key: string ]: any;

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
};

export function UnstyledButton(props: Props) {
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
		<Tag {...passedProps}
			className={props.class}
			target={Tag === 'a' ? '_blank' : undefined}
			rel={Tag === 'a' ? 'noreferrer noopener' : undefined}
		/>
	);
}

function BaseButton(props: Props) {
	const size = (typeof props.size === 'number' ? props.size : SIZES[props.size || props.small ? 'small' : 'large']) * 4;
	const paddingThreshold = (size < 40) ? (props.rounded) ? 24 : 28 : 32;

	const style = {
		...props.style,
		height: size,
		width: props.iconOnly ? size : undefined,
		paddingLeft: props.iconOnly ? undefined : size - paddingThreshold,
		paddingRight: props.iconOnly ? undefined : size - paddingThreshold
	};

	return (
		<UnstyledButton
			{...props}
			style={style}
			class={merge(
				'flex w-max items-center justify-center group font-bold uppercase tracking-widest select-none transition-all',
				'hover:shadow-md focus-visible:shadow-md active:shadow-none outline-none',
				'active:ring focus-visible:ring dark:ring-offset-neutral-750',
				'active:ring-offset-2 focus-visible:ring-offset-2 !outline-none',
				props.rounded ? 'rounded-full' : 'rounded',	props.class)}>

			{props.children}
			{props.icon && !props.iconRight && <Svg src={props.icon} size={6}/>}
			{props.label && <span class={merge('text-xs mt-px -mb-px', props.iconOnly && 'sr-only')}
				style={{ paddingLeft: size - paddingThreshold, paddingRight: size < 48 ? 4 : 0 }}>{props.label}</span>}
			{props.icon && props.iconRight && <Svg src={props.icon} size={6}/>}
		</UnstyledButton>
	);
}

export function Primary(props: Props) {
	return (
		<BaseButton {...props} class={merge(
			'bg-accent-600 hover:bg-accent-700 focus-visible:bg-accent-700 active:bg-accent-900',
			'text-white hover:text-accent-100 focus-visible:text-accent-100 active:text-accent-200',
			'primary-white active:primary-300',
			'secondary-300 active:secondary-500',
			'ring-accent-300 active:ring-accent-400',

			'dark:hover:bg-accent-500 dark:focus-visible:bg-accent-500',
			'dark:active:bg-accent-700 dark:ring-accent-800/75',
			'dark:hover:text-white dark:focus-visible:text-white dark:active:text-accent-100',
			'dark:active:primary-white dark:active:secondary-300',
			props.class)}/>
	);
}

export function Secondary(props: Props) {
	return (
		<BaseButton {...props} class={merge(
			'bg-accent-200 hover:bg-accent-600 focus-visible:bg-accent-600 active:bg-accent-900',
			'text-accent-900 hover:text-accent-100 focus-visible:text-accent-100 active:text-accent-200',
			'primary-900 hover:primary-100 focus-visible:primary-100 active:primary-200',
			'secondary-400 hover:secondary-300 focus-visible:secondary-300 active:secondary-400',
			'ring-accent-300 active:ring-accent-400 dark:ring-offset-neutral-800 dark:ring-accent-900',

			'dark:bg-accent-500/30 dark:hover:bg-accent-500/40',
			'dark:focus-visible:bg-accent-500/40 dark:active:bg-accent-500/25',
			'dark:text-accent-100 dark:hover:text-white dark:focus-visible:text-white dark:active:text-accent-200',
			'dark:primary-100 dark:secondary-400',
			'dark:ring-accent-500/20 dark:active:ring-accent-500/20',
			props.class)}/>
	);
}

export function Tertiary(props: Props) {
	return (
		<BaseButton {...props} class={merge(
			'bg-neutral-200 hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-500',
			'text-neutral-600 hover:text-neutral-700 focus-visible:text-neutral-700 active:text-neutral-100',
			'primary-neutral-600 active:primary-neutral-100',
			'secondary-neutral-500 active:secondary-neutral-300',
			'ring-neutral-300 active:ring-neutral-400',

			'dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:focus-visible:bg-neutral-500 dark:active:bg-neutral-600',
			'dark:text-neutral-100 dark:hover:text-neutral-50',
			'dark:focus-visible:text-neutral-50 dark:active:text-neutral-200',
			'dark:primary-neutral-100 dark:secondary-neutral-300',
			'dark:ring-neutral-600 dark:active:ring-neutral-600',
			props.class)}/>
	);
}


export function Link(props: Props) {
	return (
		<UnstyledButton {...props} class={merge(
			'group relative inline !outline-none leading-none isolate',
			'primary-700 active:primary-white secondary-400 active:secondary-200',
			'dark:primary-200 dark:hover:primary-white dark:focus-visible:primary-white dark:active:primary-neutral-700',
			'dark:secondary-400 dark:hover:secondary-200 dark:focus-visible:secondary-200 dark:active:secondary-neutral-900',
			props.icon && 'ml-0.5', props.class)}>

			<div class='absolute z-10 transition-all ease-out rounded-sm
				w-full group-hover:w-[calc(100%+8px)] group-focus-visible:w-[calc(100%+8px)] group-active:w-[calc(100%+8px)]
				bottom-px group-hover:-bottom-0.5 group-focus-visible:-bottom-0.5 group-active:-bottom-0.5
				left-0 group-hover:-left-1 group-focus-visible:-left-1 group-active:-left-1
				h-1 group-hover:h-[calc(100%+6px)] group-focus-visible:h-[calc(100%+6px)] group-active:h-[calc(100%+6px)]
				bg-accent-500/30 group-hover:bg-accent-500/20 group-focus-visible:bg-accent-500/20 group-active:bg-accent-500

				dark:bg-accent-400/25 dark:group-hover:bg-accent-400/20
				dark:group-focus-visible:bg-accent-400/20 dark:group-active:bg-accent-400'/>

			{props.icon && !props.iconRight &&
				<Svg src={props.icon} size={5} class='relative z-10 inline-block -mb-1 -mt-1 -mx-0.5'/>}

			<span class={merge(
				'z-10 font-medium',
				'text-accent-700 group-hover:text-accent-600',
				'group-focus-visible:text-accent-600 group-active:text-white',

				'dark:text-accent-300 dark:group-hover:text-white',
				'dark:group-focus-visible:text-white dark:group-active:text-neutral-800',
				props.iconOnly ? 'sr-only' : ((props.icon ? props.iconRight ? 'mr-1' : 'ml-1' : '') + ' relative'))}>
				{props.label}
			</span>

			{props.icon && props.iconRight &&
				<Svg src={props.icon} size={5} class='relative z-10 inline-block -mb-1 -mt-1 -mx-0.5'/>}
		</UnstyledButton>
	);
}
