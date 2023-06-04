import { h } from 'preact';
import { tw } from 'dashboard';
import type { BaseDashboardFieldProps } from '../../Type';

export interface CheckboxFieldProps extends BaseDashboardFieldProps<boolean | null> {
	type: 'checkbox';
};

export default function CheckboxField(props: CheckboxFieldProps) {
	return (
		<div class={tw`bg-gray-input rounded p-3 ${props.value ? 'text-gray-50' : 'text-gray-300'}`}>
			{props.value ? 'True' : 'False'}
		</div>
	);
}
