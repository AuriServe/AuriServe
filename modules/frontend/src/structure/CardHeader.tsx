import * as Preact from 'preact';

import './CardHeader.sass';

interface Props {
	icon: string;
	title: string;
	subtitle?: string;
}

export default function CardHeader(props: Props) {
	return (
		<div class='CardHeader'>
			<img class='CardHeader-Icon' src={props.icon} alt=''/>
			<div class='CardHeader-Content'>
				<h1 class='CardHeader-Title'>{props.title}</h1>
				<p class='CardHeader-Description'>{props.subtitle ?? ''}</p>
			</div>
		</div>
	);
}
