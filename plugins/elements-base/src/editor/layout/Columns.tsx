import { h, Fragment } from 'preact';
import type { ComponentChildren } from 'preact';

import { tw } from 'dashboard';
import { Overlay, useElement } from 'page-editor';

import { randomIdentifier } from '../../common/util';

export type Props = {
	reverseVertical?: boolean;

	layoutChildren?: 'flex-start' | 'flex-end' | 'stretch' | 'center';
	justifyChildren?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';

	gap?: number;
	minWidth?: number;
	maxWidth?: number;
	columns?: { min?: string; width: string }[];

	style?: any;
	class?: string;
	children?: ComponentChildren;
};

function range(count: number) {
	return [ ...Array(count).keys() ];
}

/**
 * Renders a horizontal row of columns, with their own responsive sizes.
 * Can collapse into a single column layout after a minimum height is achieved.
 *
 * The column layout is a colon-separated list of values, each value can either be a number or minmax specifier.
 * A minmax specifier is a parentheses-enclosed list of two values separated by commas,
 * The first is the min value, the second is the max value.
 * Values can either be pixel units (px), fractional units (fr), or percentages. Spaces are ignored.
 *
 * Example: "(200px, 400px):3fr"
 */

function Columns(props: Props) {
	const element = useElement();
	const identifier = props.minWidth ? randomIdentifier() : '';

	function handleResizeGap(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();

		const handle = evt.target! as HTMLElement;
		const handleParentBounds = handle.parentElement!.getBoundingClientRect();

		const currentSize = Math.abs((evt.clientX - (handleParentBounds.left + handleParentBounds.width / 2)) * 2);
		const initialSize = props.gap ?? 0;
		const offset = currentSize - initialSize;

		const handleMouseMove = (evt: MouseEvent) => {
			let currentSize = Math.abs((evt.clientX -
				(handleParentBounds.left + handleParentBounds.width / 2)) * 2) - offset;

			if (evt.getModifierState('Control')) {
				if (currentSize <= 64) currentSize = Math.round(currentSize / 8) * 8;
				else if (currentSize <= 128) currentSize = Math.round(currentSize / 16) * 16;
				else currentSize = Math.round(currentSize / 32) * 32;
			}

			element.setProps({ ...props, gap: currentSize });
		}

		document.addEventListener('mousemove', handleMouseMove);

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}

		document.addEventListener('mouseup', handleMouseUp);
	}


	function handleResizeMaxWidth(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();

		const handle = evt.target! as HTMLElement;
		const outerBounds = handle.parentElement!.parentElement!.getBoundingClientRect();

		const currentSize = Math.abs((outerBounds.left + outerBounds.width / 2) - evt.clientX) * 2;
		const initialSize = props.maxWidth ?? Infinity;
		const offset = currentSize - initialSize;

		const handleMouseMove = (evt: MouseEvent) => {
			let currentSize = Math.abs((outerBounds.left + outerBounds.width / 2) - evt.clientX) * 2 - offset;

			if (evt.getModifierState('Control')) {
				if (currentSize <= 64) currentSize = Math.round(currentSize / 8) * 8;
				else if (currentSize <= 128) currentSize = Math.round(currentSize / 16) * 16;
				else currentSize = Math.round(currentSize / 32) * 32;
			}

			element.setProps({ ...props, maxWidth: currentSize });
		}

		document.addEventListener('mousemove', handleMouseMove);

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}

		document.addEventListener('mouseup', handleMouseUp);
	}

	const gridColumnString = (props.columns ?? [{ width: '1fr' }]).map(({ min, width }) =>
		min ? `minmax(${min}, ${width})` : width).join(' ');

	return (
		<Fragment>
			<div
				class={['base:columns', identifier, props.class, props.reverseVertical && 'reverse']
					.filter((s) => s)
					.join(' ')}>
				{props.minWidth && (
					<style
						dangerouslySetInnerHTML={{
							__html: `@media(max-width:${props.minWidth}px)}){.base\\:columns.${identifier}>.inner{display:flex}}`,
						}}
					/>
				)}
				<div
					class='inner'
					style={{
						gap: `${props.gap}px`,
						maxWidth: props.maxWidth && `${props.maxWidth}px`,
						gridTemplateColumns: gridColumnString,
						alignItems: props.layoutChildren ?? 'stretch',
						justifyContent: props.justifyChildren
					}}>
					{props.children}
				</div>
			</div>
			{(element.focused || element.hovered) && <Overlay class={tw`${!element.focused && 'opacity-50'}`}>
				<div class={tw`group absolute h-full left-0 top-0 bg-accent-400/25 rounded
					${element.focused && 'interact-auto'}`}
					style={{ width: `calc((100% - ${props.maxWidth}px) / 2 - 6px)` }}>
					<div class={tw`absolute w-2 h-full top-0 -right-1 cursor-e-resize`} onMouseDown={handleResizeMaxWidth}/>
				</div>

				<div class={tw`group absolute h-full right-0 top-0 bg-accent-400/25 rounded
					${element.focused && 'interact-auto'} `}
					style={{ width: `calc((100% - ${props.maxWidth}px) / 2 - 6px)` }}>
					<div class={tw`absolute w-2 h-full top-0 -left-1 cursor-w-resize`} onMouseDown={handleResizeMaxWidth}/>
				</div>

				<div class={tw`absolute w-full h-full grid`} style={{
					width: `min(100%, ${props.maxWidth}px)`,
					left: props.maxWidth ? `max(0px, calc((100% - ${props.maxWidth}px) / 2))` : '0px',
					gap: `${props.gap}px`,
					gridTemplateColumns: gridColumnString
				}}>
					{range((props.columns?.length ?? 1) - 1).map(i => <div key={i} class={tw`w-full relative`}>
						<div class={tw`bg-accent-400/25 absolute h-full rounded
							w-[${Math.max((props.gap || 0) - 12, 0)}px] left-[calc(100%+6px)] px-1
								${element.focused && 'interact-auto'}`}>
								<div class={tw`w-full h-full cursor-ew-resize`}/>
								<div class={tw`absolute w-2 h-full top-0 -left-1 cursor-w-resize`} onMouseDown={handleResizeGap}/>
								<div class={tw`absolute w-2 h-full top-0 -right-1 cursor-e-resize`} onMouseDown={handleResizeGap}/>
								{element.focused && <div class={tw`absolute w-0.5 h-full bg-accent-500 top-0 left-1/2`}/>}
						</div>
					</div>)}
				</div>

				{/* <div class={tw`absolute `} style={{
					width: `calc((100% - ${props.maxWidth}px) / 2 - 8px)` }}/>
				<div class={tw`absolute rounded bg-accent-400/25 h-full right-0 top-0`} style={{
					width: `calc((100% - ${props.maxWidth}px) / 2 - 8px)` }}/> */}
			</Overlay>}
		</Fragment>
	);
}

export default { identifier: 'base:columns', component: Columns, };
