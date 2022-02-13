import { Fragment, h } from 'preact';

import Svg from '../Svg';
import { tw } from '../Twind';
import { SecondaryButton } from '../Button';

import icon_home from '@res/icon/home.svg';
import icon_target from '@res/icon/target.svg';

export default function UnknownPage() {
	return (
		<Fragment>
			<div
				class={tw`flex-(& col) justify-center items-center gap-2 animate-drop-fade-in`}>
				<Svg src={icon_target} size={12} class={tw`p-6 bg-gray-800 rounded-lg mb-4`} />
				<p class={tw`leading-none text-xl text-gray-100 font-medium`}>Page not found.</p>
				<p class={tw`text-gray-200`}>
					The plugin responsible for this page may still be loading.
				</p>
				<SecondaryButton
					to='/'
					icon={icon_home}
					label='Go Home'
					class={tw`mt-8 mb-32 dark:!ring-offset-gray-900`}
				/>
			</div>
		</Fragment>
	);
}
