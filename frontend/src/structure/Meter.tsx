import { h } from 'preact';

interface Props {
	max: number;
	value: number;

	class?: string;
}

export default function Meter(props: Props) {
	return (
		<div
			class='flex w-full h-8 p-1 rounded overflow-hidden bg-neutral-50
		dark:bg-neutral-800 dark:shadow-inner border border-neutral-200 dark:border-neutral-600'>
			<div
				class='bg-gradient-to-tl from-indigo-600 to-blue-500 rounded-sm shadow'
				style={{ width: `${(props.value / props.max) * 100 || 50}%` }}
			/>
		</div>
	);
}
