import { h } from 'preact';
import { useContext, useLayoutEffect } from 'preact/hooks';
import { tw, AppContext, Button, Icon, Svg } from 'dashboard';

const WEEKDAYS = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

const EVENTS = [{
	ind: 3,
	len: 2,
	title: 'At Your Service',
	theme: 'amber'
}, {
	ind: 8,
	len: 1,
	title: 'Tiller\'s Folly',
	theme: 'amber'
}, {
	ind: 16,
	len: 3,
	title: 'The Wardens'
}, {
	ind: 16,
	len: 2,
	title: 'Early Morning Rain',
	theme: 'amber'
}, {
	ind: 16,
	len: 2,
	title: 'Early Morning Rain II',
	theme: 'amber'
}];


export default function CalendarPage() {
	const app = useContext(AppContext);
	useLayoutEffect(() => (app.setHijackScrollbar(false), () => app.setHijackScrollbar(true)));

	return (
		<div class={tw`flex -mb-14`}>
			<div class={tw`shrink-0 w-72 bg-gray-800 border-(r gray-700) relative z-10`}/>
			<div class={tw`grow flex-(& col)`}>
				<div class={tw`shrink-0 flex justify-between items-center px-2 py-3`}>
					<div class={tw`flex items-center`}>
						<Svg src={Icon.calendar} size={6}/>
						<h2 class={tw`text-xl leading-none font-medium ml-2`}>September 2022</h2>
					</div>
					<div class={tw`flex gap-3`}>
						<Button.Secondary small icon={Icon.add} label='Add Event'/>
					</div>
				</div>
				<div class={tw`grow bg-gray-900 grid-(& cols-7 rows-5) gap-1.5 p-2 pt-0`}>
					{Array.from(Array(7 * 5).keys()).map((_, i) => <div key={i}
						class={tw`relative rounded-md p-2 pt-9 flex-(& col) gap-2 ${(i < 4 || i > 7 * 4 + 2) ? 'bg-gray-800/25' : 'bg-gray-800/50'}`}>
						<p class={tw`absolute top-2 left-2 w-5 h-5 mr-auto pt-px text-gray-100 text-center font-bold text-sm
							${i === 9 && `rounded-full bg-accent-400 text-gray-900
							ring-(& accent-500/25 offset-gray-900)`}`}>{i}</p>
						{i < 7 && <p class={tw`absolute top-2.5 left-10 pt-px text-gray-300 font-bold text-xs uppercase tracking-widest`}>
							{WEEKDAYS[i]}
						</p>}
						{EVENTS.filter(event => event.ind === i).map(event => <div key={event.title} class={tw`
							bg-gray-750 rounded theme-${event.theme ?? 'blue'} relative
							p-1.5 px-2.5 text-sm font-bold flex gap-2.5 items-center relative z-10 shadow-md text-accent-100
							hover:(bg-gray-700 text-accent-50) transition duration-75 cursor-pointer`}
							style={{ width: `calc(${event.len} * (100% + 14px) + ${event.len - 1} * (8px) - 14px`}}>
							<div class={tw`w-2 h-2 shrink-0 ring-(& accent-400/25) bg-accent-400 rounded-full`}/>
							<p>{event.title}</p>
							<div class={tw`absolute w-16 h-full left-0 rounded-l bg-gradient-to-r from-accent-400/20 via-accent-400/5 to-transparent interact-none`}/>
						</div>)}
					</div>)}
				</div>
			</div>
		</div>
	);
}
