import { h } from 'preact';
import { tw, Svg, Icon, Button } from 'dashboard';
import { useEffect, useRef, useState } from 'preact/hooks';

import CalendarMonth from './CalendarMonth';

import { PopulatedCalendar } from '../common/Calendar';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

function offsetPageBy(page: { month: number, year: number }, offset: number) {
	const newMonth = page.month + offset;
	const newYear = page.year + (newMonth > 12 ? 1 : newMonth < 1 ? -1 : 0);
	return { month: (newMonth - 1 + 12) % 12 + 1, year: newYear };
}

interface Props {
	calendar: PopulatedCalendar;
}

export default function MonthView(props: Props) {
	const viewRef = useRef<HTMLDivElement>(null);

	const [ page, setPage ] = useState<{ month: number, year: number }>({
		month: new Date().getMonth() + 1, year: new Date().getFullYear()
	});

	const [ scrolling, setScrolling ] = useState<boolean>(false);

	useEffect(() => {
		const elem = viewRef.current;
		if (!elem) return;

		let timeout = 0;
		let lastScroll = performance.now();
		const onScroll = (evt: any) => {
			if (performance.now() - lastScroll > 100) {
				setPage(page => offsetPageBy(page, evt.deltaY > 0 ? 1 : -1));
				lastScroll = performance.now();
				setScrolling(true);
				window.clearTimeout(timeout);
				timeout = setTimeout(() => setScrolling(false), 200) as any as number;
			}
		}

		elem.addEventListener('wheel', onScroll);
		return () => elem.removeEventListener('wheel', onScroll);
	}, []);

	const lastPage = offsetPageBy(page, -1);
	const nextPage = offsetPageBy(page, 1);

	return (
		<div ref={viewRef} class={tw`grow flex-(& col)`}>
			<div class={tw`shrink-0 flex justify-between items-center px-2 py-3`}>
				<div class={tw`flex items-center`}>
					<Svg src={Icon.calendar} size={6}/>
					<h2 class={tw`text-xl leading-none font-medium ml-2`}>{MONTH[page.month - 1]} {page.year}</h2>
				</div>
				<div class={tw`flex gap-3`}>
					<Button.Secondary small icon={Icon.add} label='Add Event'/>
				</div>
			</div>
			<div class={tw`relative grow overflow-hidden group rounded`}>
				{[ lastPage, page, nextPage ].map((iPage) =>
					<div key={iPage.month + iPage.year * 12} class={tw`
						absolute grid inset-0 transition duration-200
						${scrolling && 'will-change-transform'}
						${!scrolling && iPage !== page && '[visibility:hidden]'}
						${iPage !== page && 'scale-95 opacity-0'}
						${iPage !== page && (iPage === lastPage ? '-translate-y-full' : 'translate-y-full')}`}>
						<CalendarMonth month={iPage.month} year={iPage.year} calendar={props.calendar}/>
					</div>
				)}
			</div>
		</div>
	);
}
