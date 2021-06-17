import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

import './ColumnLayout.sss';

type Props = Partial<{
	maxWidth: number | string;
	minWidth: number;
	gap: number | string;
	columns: string;
	reverseVertical: boolean;
	layoutChildren: 'start' | 'end' | 'stretch' | 'center';

	style: string;
	class: string;
	children: Preact.VNode | Preact.VNode[];
}>;

const parseMinMax = (min: string, natural: string, _max?: string) =>
	'minmax(' + min + ', ' + natural + ')';

const parseColumn = (raw: string) =>
	raw.startsWith('(') ? parseMinMax(...(raw.substr(1, raw.length - 2).split(',')) as unknown as [string, string, string?]) : raw;


function parseColumns(raw?: string): string {
	if (!raw) return 'repeat(auto-fit, 1fr)';
	let columns = raw.replace(/ /g, '').split(':').filter(s => s);
	return columns.map(parseColumn).join(' ');
}

const randomIdentifier = () => 'i' + Math.random().toString(36).substring(7);

const toCSSUnit = (val: number | string) => (typeof val === 'string' ? val : val + 'px');

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

function ColumnLayout(props: Props) {
	const identifier = props.minWidth ? randomIdentifier() : '';
	return (
		<div class={[ 'ColumnLayout', identifier, props.class, props.reverseVertical && 'Reverse' ].filter(s => s).join(' ')}>
			{props.minWidth && <style dangerouslySetInnerHTML={{ __html:
				`@media(max-width:${toCSSUnit(props.minWidth)}){.ColumnLayout.${identifier} > .ColumnLayout-Columns{display:flex}}`}
			}/>}
			<div class='ColumnLayout-Columns' style={{
				maxWidth: props.maxWidth && toCSSUnit(props.maxWidth),
				gap: props.gap && toCSSUnit(props.gap),
				gridTemplateColumns: parseColumns(props.columns),
				alignItems: props.layoutChildren === 'start' ? 'flex-start' :
					props.layoutChildren === 'end' ? 'flex-end' : props.layoutChildren ?? 'stretch'
			}}>
				{props.children}
			</div>
		</div>
	);
}

export const server: ServerDefinition = {
	identifier: 'ColumnLayout',
	element: ColumnLayout,
	config: {
		props: {
			maxWidth: { name: 'Max Width', type: 'number', optional: true },
			minWidth: { name: 'Collapse At', type: 'number', optional: true },
			columns: { name: 'Column Layout', type: 'custom', optional: true },
			gap: { name: 'Column Gap', type: [ 'number', 'text' ], optional: true },
			reverseVertical: { name: 'Reverse Collaped Layout', type: 'boolean', default: false },
			layoutChildren: { name: 'Layout Children', type: [ [ 'start', 'end', 'center', 'stretch' ] ], default: 'stretch' }
		}
	}
};
