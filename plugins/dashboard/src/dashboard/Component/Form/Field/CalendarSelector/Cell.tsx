import { h } from 'preact';
import { tw } from '../../../../Twind';


export const Placeholder = Symbol('placeholder');

function isSameDate(a: Date, b: Date) {
	return a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear();
}

interface Props {
	date: Date;
	min?: Date;
	max?: Date;
	selected: Date | null;

	onClick: () => void;
}

export default function Cell(props: Props) {
	const dark = props.date.getMonth() % 2 === 1;
	const isCurrentDate = isSameDate(props.date, new Date());
	const isInvalid = props.min && +props.date + 24 * 60 * 60 * 1000 - 1 < +props.min || props.max && props.date > props.max;

	return (
		<button type='button' onClick={props.onClick} class={tw`
			block cursor-pointer rounded w-full flex justify-center items-center
			text-sm transition select-none outline-none
			${isInvalid && 'interact-none !bg-transparent !text-gray-500'}
			${props.selected && !isInvalid && isSameDate(props.date, props.selected)
				? '!text-white !bg-gray-300' : 'active:(!text-white !bg-gray-400)'}
			${isCurrentDate
				? 'bg-accent-600/25 hocus:bg-accent-600/50 text-accent-300 font-bold'
				: `font-medium hocus:(bg-gray-500 text-white)
					${dark ? 'bg-gray-600/50 text-gray-200' : 'bg-gray-600 text-gray-100'}`}`}>
			{props.date.getDate()}
		</button>
	);
}
