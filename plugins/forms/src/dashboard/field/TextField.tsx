import { h } from 'preact';
import { tw } from 'dashboard';
import type { BaseDashboardFieldProps } from '../../Type';

export interface TextFieldProps extends BaseDashboardFieldProps<string | null> {
	type: 'text' | 'email' | 'tel' | 'textarea';
};

export default function TextField(props: TextFieldProps) {
	return (
		<div class={tw`bg-gray-input rounded p-2.5 pt-1.5 pb-1 max-w-full overflow-hidden`}>

			<p class={tw`text-gray-300 truncate interact-none text-xs font-bold`}>
				{props.field.shortName ?? props.field.label}
			</p>

			<p class={tw`${props.value ? 'text-gray-100' : 'text-gray-400'}`}>
				{props.value ? props.value : '(Empty)'}
			</p>
		</div>
	);
}
