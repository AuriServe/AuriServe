import { Fragment, h } from 'preact';

import Svg from '../Svg';
import { SecondaryButton } from '../Button';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';

export default function UnknownPage() {
	return (
		<Fragment>
			<div
				class={tw`flex-(& col) justify-center items-center gap-2 animate-drop-fade-in`}>
				<Svg src={Icon.target} size={12} class={tw`p-6 bg-gray-800 rounded-lg mb-4`} />
				<p class={tw`leading-none text-xl text-gray-100 font-medium`}>Page not found.</p>
				<p class={tw`text-gray-200`}>
					The plugin responsible for this page may still be loading.
				</p>
				<SecondaryButton
					to='/'
					icon={Icon.home}
					label='Go Home'
					class={tw`mt-8 mb-32 dark:!ring-offset-gray-900`}
				/>
			</div>
		</Fragment>
	);
}
