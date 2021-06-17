import * as Preact from 'preact';

interface Props {
	max: number;
	value: number;
	
	class?: string;
}

export default function Meter(props: Props) {
	return (
		<div class='flex w-full h-8 p-1 rounded overflow-hidden bg-gray-900
		dark:bg-gray-100 dark:shadow-inner border border-gray-700 dark:border-gray-300'>
			<div class='bg-gradient-to-tl from-indigo-600 to-blue-500 rounded-sm shadow'
				style={{ width: (((props.value / props.max) * 100) || 50) + '%' }}/>
		</div>
	);
}
