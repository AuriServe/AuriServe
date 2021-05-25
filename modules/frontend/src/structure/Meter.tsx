import * as Preact from 'preact';

import './Meter.sass';

interface Props {
	size: number;
	usage: number;
	
	class?: string;
}

export default function Meter(props: Props) {
	return (
		<div class={('Meter ' + (props.class ?? '')).trim()}>
			<div class='Meter-Progress' style={{ width: ((props.usage / props.size) * 100) + '%' }}/>
		</div>
	);
}
