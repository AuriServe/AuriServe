import { h } from 'preact';
import { tw, AppContext, Button, Icon } from 'dashboard';
import { useContext, useLayoutEffect } from 'preact/hooks';


export default function CalendarPage() {
	const app = useContext(AppContext);
	useLayoutEffect(() => (app.setHijackScrollbar(false), () => app.setHijackScrollbar(true)));

	return (
		<div class={tw`flex -mb-14`}>
			<div class={tw`shrink-0 w-72 bg-gray-800 border-(r gray-700) relative z-10`}/>
			<div class={tw`grow flex-(& col)`}>
				<div class={tw`shrink-0 bg-gray-800 flex justify-between items-center p-3 border-(b gray-700)`}>
					<h2 class={tw`text-xl ml-2 leading-none font-medium`}>September 2022</h2>
					<div class={tw`flex gap-3`}>
						<Button.Tertiary icon={Icon.view} label='Month'/>
						<Button.Secondary icon={Icon.add} label='Add Event'/>
					</div>
				</div>
				<div class={tw`shrink-0 h-10 bg-gray-800/50 grid-(& cols-7) gap-px relative z-10 shadow border-(b gray-700)`}>
					{[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ].map((day) => <div key={day}
						class={tw`text-center relative font-medium leading-none flex items-center justify-center`}>
						<p class={tw`${day === 'Tue' && 'bg-accent-400 text-gray-900 inline-block px-3 py-1 rounded-full'}`}>
							{day}
						</p>
					</div>)}
				</div>
				<div class={tw`grow bg-gray-700/75 grid-(& cols-7 rows-5) gap-px`}>
					{Array.from(Array(7 * 5).keys()).map((_, i) => <div key={i}
						class={tw`${(i < 4 || i > 7 * 4 + 2) ? 'bg-gray-900/75' : 'bg-gray-900'}`}>
						<p class={tw`mt-2 ml-2 w-5 h-5 mr-auto pt-px text-gray-200 text-center font-bold text-sm
							${i === 9 && `rounded-full bg-accent-400 text-gray-900
							ring-(2 accent-500/25 offset-2 offset-gray-900)`}`}>{i}</p>
					</div>)}
				</div>
			</div>
		</div>
	);
}
