import { h } from 'preact';
import { useContext } from 'preact/hooks';

import Card from '../Card';

import { AppContext } from '../App';
import { executeQuery } from '../../Graph';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';

const COLORS = [ 'indigo', 'blue', 'cyan', 'emerald', 'lime', 'amber', 'red', 'pink', 'purple' ];

export default function AppearanceSettings() {
	const { data, mergeData } = useContext(AppContext);

	function handleSetTheme(theme: string) {
		mergeData({ user: { ...data.user, theme }});
		executeQuery(`mutation { setTheme(theme: '${theme}') }`);
	}

	return (
		<Card>
			<Card.Header icon={Icon.theme} title='Appearance' subtitle='Manage the appearance of your dashboard.' />
			<Card.Body>
				<div class={tw`flex gap-8`}>
					<div class={tw`w-64 shrink-0`}>
						<p class={tw`font-medium mb-1`}>Color Theme</p>
						<p class={tw`text-gray-300 text-sm`}>The accent color of the dashboard.</p>
					</div>
					<div class={tw`flex gap-3 grow p-1`}>
						{COLORS.map(theme => (
							<button key={theme} onClick={() => handleSetTheme(theme)} class={tw`
									theme-${theme} relative w-10 h-10 rounded overflow-hidden
									bg-accent-100 dark:bg-accent-900 shadow-md transition outline-none
									ring-(opacity-100 dark:offset-gray-800 hover:(2 offset-2 accent-500) focus:(2 offset-2 accent-600))
									active:(ring-(2 offset-2 accent-500) brightness-[110%])
									${data.user.theme === theme && '!ring-(2 offset-2 white)'}`}>
								<div class={tw`absolute bg-accent-500 inset-0 rounded-tl-[70%] rounded-br`}
									style={{ boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.2)' }}/>
								<div class={tw`absolute bg-accent-300 inset-0 left-[25%] top-[25%] rounded-tl-[85%] rounded-br`}
									style={{ boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.15)' }}/>
								<div class={tw`absolute bg-accent-100 inset-0 left-[60%] top-[60%] rounded-tl-[80%]`}
									style={{ boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.1)' }}/>
							</button>
						))}
					</div>
				</div>

			</Card.Body>
		</Card>
	);
			{/* <div class='h-8 mt-1 w-[3px] bg-neutral-300 dark:bg-neutral-600 rounded-full'/>

			<Button.Tertiary label='Switch Mode' iconOnly size={10}
				onClick={() => setPreferences({ ...preferences, theme: lightMode ? 'dark' : 'light' })}>
				<div class='w-6 h-6 relative'>
					<Svg src={icon_theme_light} size={6} class={mergeClasses(
						'absolute inset-0 delay-75 transition', !lightMode && 'scale-150 opacity-0')}/>
					<Svg src={icon_theme_dark} size={6} class={mergeClasses(
						'absolute inset-0 delay-75 transition', lightMode && 'scale-50 opacity-0')}/>
				</div>
			</Button.Tertiary> */}
}
