import { h } from 'preact';
import type { ComponentChildren } from 'preact';

import { randomIdentifier } from '../../common/util';

export type Props = {
	maxWidth?: number;
	minWidth?: number;
	gap?: number;
	columns?: string;
	reverseVertical?: boolean;
	layoutChildren?: 'start' | 'end' | 'stretch' | 'center';
	justifyChildren?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';

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

function Columns(props: Props) {
	const identifier = props.minWidth ? randomIdentifier() : '';
	return (
		<div
			class={['base:columns', identifier, props.class, props.reverseVertical && 'reverse']
				.filter((s) => s)
				.join(' ')}>
			{props.minWidth && (
				<style
					dangerouslySetInnerHTML={{
						__html: `@media(max-width:${toCSSUnit(
							props.minWidth
						)}){.base\\:columns.${identifier}>.inner{display:flex}}`,
					}}
				/>
			)}
			<div
				class='inner'
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
					justifyContent: props.justifyChildren
				}}>
				{props.children}
			</div>
		</div>
	);
}

export default { identifier: 'base:columns', component: Columns, };
