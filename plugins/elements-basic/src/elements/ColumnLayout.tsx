import { h } from 'preact';
// import { forwardRef } from 'preact/compat';
import type { ComponentChildren } from 'preact';

export type Props = {
	maxWidth?: number;
	minWidth?: number;
	gap?: number;
	columns?: string;
	reverseVertical?: boolean;
	layoutChildren?: 'start' | 'end' | 'stretch' | 'center';

	style?: any;
	class?: string;
	children?: ComponentChildren;
};

const parseMinMax = (min: string, natural: string) => `minmax(${min}, ${natural})`;

const parseColumn = (raw: string) =>
	raw.startsWith('(')
		? parseMinMax(
				...(raw.substring(1, raw.length - 1).split(',') as unknown as [string, string])
		  )
		: raw;

export function parseColumns(raw?: string): string {
	if (!raw) return 'repeat(auto-fit, 1fr)';
	const columns = raw
		.replace(/ /g, '')
		.split(':')
		.filter((s) => s);
	return columns.map(parseColumn).join(' ');
}

const randomIdentifier = () => `i${Math.random().toString(36).substring(7)}`;

export const toCSSUnit = (val: number | string) =>
	typeof val === 'string' ? val : `${val}px`;

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

export function ColumnLayout(props: Props) {
	const identifier = props.minWidth ? randomIdentifier() : '';
	return (
		<div
			class={['ColumnLayout', identifier, props.class, props.reverseVertical && 'Reverse']
				.filter((s) => s)
				.join(' ')}>
			{props.minWidth && (
				<style
					dangerouslySetInnerHTML={{
						__html: `@media(max-width:${toCSSUnit(
							props.minWidth
						)}){.ColumnLayout.${identifier}>.ColumnLayout-Columns{display:flex}}`,
					}}
				/>
			)}
			<div
				class='ColumnLayout-Columns'
				style={{
					maxWidth: props.maxWidth && toCSSUnit(props.maxWidth),
					gap: props.gap && toCSSUnit(props.gap),
					gridTemplateColumns: parseColumns(props.columns),
					alignItems:
						props.layoutChildren === 'start'
							? 'flex-start'
							: props.layoutChildren === 'end'
							? 'flex-end'
							: props.layoutChildren ?? 'stretch',
				}}>
				{props.children}
			</div>
		</div>
	);
}

export default {
	identifier: 'ColumnLayout',
	component: ColumnLayout,
};
