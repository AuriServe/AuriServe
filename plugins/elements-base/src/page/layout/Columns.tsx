import { h } from 'preact';
import type { ComponentChildren } from 'preact';

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

	const gridColumnString = (props.columns ?? [{ width: '1fr' }]).map(({ min, width }) =>
		min ? `minmax(${min}, ${width})` : width).join(' ');

	return (
		<div
			class={['base:columns', identifier, props.class, props.reverseVertical && 'reverse']
				.filter((s) => s)
				.join(' ')}>
			{props.minWidth && (
				<style
					dangerouslySetInnerHTML={{
						__html: `@media(max-width:${props.minWidth}px){.base\\:columns.${identifier}>.inner{display:flex}}`,
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
	);
}

export default { identifier: 'base:columns', component: Columns, };
