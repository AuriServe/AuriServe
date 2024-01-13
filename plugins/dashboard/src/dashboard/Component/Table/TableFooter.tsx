import { h } from 'preact';

import { Classes, useClasses } from '../../Hooks';
import { merge, tw } from '../../Twind';

interface Props {
	class?: Classes;
}

export default function TableFooter(props: Props) {
	const classes = useClasses(props.class);
	return (
		<div class={merge(tw``, classes.get())}>
			<p>Test</p>
		</div>
	);
}
