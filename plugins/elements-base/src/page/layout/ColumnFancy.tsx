import { h, ComponentChild } from 'preact';

export interface Column {
	pixel: number;
	fraction: number;
	maxWidth?: number;
};

export type Props = {
	gap: [ number, number ];

	columns: Column[];

	minWidth?: number;
	maxWidth?: number;

	style?: any;
	class?: string;
	children?: Record<string, ComponentChild>;
};

function Columns(props: Props) {
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
		</div>
	);
}

export default {
	identifier: 'base:column_fancy',
	component: Columns
};
