import { h } from 'preact';
import { Icon, merge, Svg, tw } from 'dashboard';
import { Overlay, useElement } from 'page-editor';

import type { Column, Props } from '../../page/layout/ColumnFancy';

function range(count: number) {
	return [ ...Array(count).keys() ];
}

function AddElementButton(props: { class?: string }) {
	return (
		<div class={merge(tw`AddElementButton~(absolute w-8 h-8 transition cursor-pointer
			scale-95 opacity-0 group~button-hover:(scale-100 opacity-100) translate-(-x-1/2 -y-1/2))`,
			props.class)}>
			<div class={tw`bg-accent-(500 hocus:600) transition rounded-lg icon-p-white shadow-md p-1`}>
				<Svg src={Icon.add} size={6}/>
			</div>
		</div>
	);
}

function VerticalSlider(props: { direction: 'w' | 'e', class?: string }) {
	return (
		<div class={merge(tw`VerticalSlider~(absolute w-4 h-full top-0 bottom-0
			cursor-${props.direction}-resize group~verticalslider group~button)`, props.class)}>
			<div class={tw`absolute w-0 left-[calc(50%-1px)] h-full opacity-0 scale-95
				border-(r-[3px] accent-300) rounded-lg transition
				group~verticalslider-hover:(opacity-100 scale-100)`}/>
			<AddElementButton class={tw`top-1/2 left-2`}/>
		</div>
	);
}

function Columns(props: Props) {
	const element = useElement();

	const gridColString = (props.columns ?? [{ fraction: 1 } as Column])
		.map(col => col.pixel !== undefined ? `${col.pixel}px` : `${col.fraction}fr`).join(' ');

	return (
		<div class='base:column_fancy'>
			<div class='columns' style={
				`grid-template-columns: ${gridColString};${
				props.gap?.[0] ? `column-gap: ${props.gap[0]}px;` : ''
				}${props.maxWidth ? `max-width: ${props.maxWidth}px;` : ''}`}>
				{Object.entries(props.children ?? {}).map(([ i, children ]) =>
					<div key={i} class='column' style={`row-gap: ${props.gap?.[1] ?? 0}px;`}>{children}</div>
				)}
			</div>

			{(element.focused || element.hovered) && <Overlay class={tw`${!element.focused && 'opacity-50'}`}>
				{/* Left Margin Indicator */}
				<div class={tw`absolute h-full left-0 top-0 bg-accent-400/20 rounded`}
					style={{ width: `calc((100% - ${props.maxWidth}px) / 2 - 6px)` }}>
					<div class={tw`absolute w-2 h-full top-0 -right-1 cursor-e-resize
						${element.focused && 'interact-auto'}`}>
						<VerticalSlider direction='e' class={tw`-left-1`}/>
					</div>
				</div>

				{/* Inner Column Dividers */}
				<div class={tw`absolute w-full h-full grid`} style={
					`${props.maxWidth ? `width: min(100%, ${props.maxWidth}px);` +
						`left: max(0px, calc((100% - ${props.maxWidth}px) / 2));` : ''}${
						props.gap?.[0] ? `column-gap: ${props.gap[0]}px;` : ''
						}grid-template-columns: ${gridColString};`}
				>
					{range((props.columns?.length ?? 1) - 1).map(i => <div key={i} class={tw`w-full relative`}>
						<div class={tw`bg-accent-400/20 absolute h-full rounded
							w-[${Math.max((props.gap?.[0] || 0) - 12, 0)}px] left-[calc(100%+6px)] px-1
								${element.focused && 'interact-auto'}`}>
								<div class={tw`w-full h-full cursor-ew-resize`}/>
								<VerticalSlider direction='w' class={tw`-left-2`}/>
								<VerticalSlider direction='e' class={tw`-right-2`}/>
						</div>
					</div>)}
				</div>

				{/* Right Margin Indicator */}
				<div class={tw`absolute h-full right-0 top-0 bg-accent-400/20 rounded`}
					style={{ width: `calc((100% - ${props.maxWidth}px) / 2 - 6px)` }}>
					<div class={tw`absolute w-2 h-full top-0 -left-1 cursor-w-resize
						${element.focused && 'interact-auto'}`}>
						<VerticalSlider direction='e' class={tw`-left-1`}/>
					</div>
				</div>
			</Overlay>}
		</div>
	);
}

export default {
	identifier: 'base:column_fancy',
	component: Columns
};
