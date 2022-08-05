import { Fragment, h } from 'preact';

import Spinner from '../Spinner';

import { tw } from '../../Twind';

export default function LoadingPage() {
	return (
		<Fragment>
			<div
				class={tw`flex-(& col) justify-center items-center gap-2 animate-drop-fade-in`}>
				<Spinner class={tw`animate-drop-fade-in`}/>
			</div>
		</Fragment>
	);
}
