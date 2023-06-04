import { h } from 'preact';
import { tw } from 'dashboard';
import type { BaseDashboardFieldProps, BaseDashboardLayoutProps, SelectClientFieldProps } from
	'../../Type';

export interface SelectFieldProps extends BaseDashboardFieldProps<
	string | string[] | null,
	BaseDashboardLayoutProps,
	SelectClientFieldProps> {
	type: 'select';
};

export default function SelectField(props: SelectFieldProps) {
	const selected: string[] = (Array.isArray(props.value) ? props.value : [ props.value ]).filter(Boolean) as any;
	return (
		<div class={tw`bg-gray-input rounded  p-2.5 pt-1.5 pb-2.5 max-w-full overflow-hidden
			${props.value ? 'text-gray-50' : 'text-gray-300'}`}>
			<p class={tw`text-gray-300 truncate interact-none text-xs font-bold pb-1`}>
				{props.field.shortName ?? props.field.label}
			</p>

			<div class={tw`max-w-full overflow-hidden flex-(& row wrap) gap-1`}>
				{selected.map((d: string) => {
					const option = props.field.options.find(o => o.id === d);
					return <span key={d} class={tw`bg-gray-600 rounded text-sm
						text-gray-50 font-bold px-2 py-1 whitespace-pre`}>
						{option?.shortName ?? option?.label ?? d}
					</span>
				})}
			</div>
		</div>
	);
}
