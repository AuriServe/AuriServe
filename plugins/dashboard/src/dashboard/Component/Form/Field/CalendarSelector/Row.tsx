import { h } from 'preact';
import { tw } from '../../../../Twind';

import Cell from './Cell';

interface Props {
	start: Date;
	selected: Date | null;
	min?: Date;
	max?: Date;
	onClick: (date: Date) => void;
}

export default function Row(props: Props) {
	const end = new Date(props.start.getFullYear(), props.start.getMonth(), props.start.getDate() + 6, 23, 59, 59, 999);
	let date = new Date(props.start);

	const cells = [];
	while (date <= end) {
		const thisDate = new Date(date);
		cells.push(<Cell date={thisDate} onClick={() => props.onClick(thisDate)}
			selected={props.selected} min={props.min} max={props.max}/>);
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		date = newDate;
	}

	return (
		<div class={tw`grid-(& cols-7) gap-1 h-8 w-full`}>
			{cells}
		</div>
	);
}
