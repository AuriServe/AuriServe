import dayjs from 'dayjs';
import { Converter } from 'showdown';
import { withHydration, ServerDefinition } from 'plugin-api';

import { Calendar, CalendarProps, EventProp, sameDay } from './Calendar';

const HydratedCalendar = withHydration('Calendar', Calendar, (props: CalendarProps) => {
	const converter = new Converter();
	converter.setFlavor('github');
	converter.setOption('emoji', true);
	converter.setOption('tables', true);

	props.events = (props.events || []).filter(f => !f.hideDate);
	props.events.forEach((event: EventProp) => {
		event.description = converter.makeHtml(event.description);
		if (event.media) event.media = event.media.map(({ url }) => ({ url }));
		event.dateString = dayjs(event.startDate).format('MMMM Do, h:mm a') +
			(event.endDate ? ' – ' + (sameDay(new Date(event.startDate), new Date(event.endDate))
				? dayjs(event.endDate).format('h:mm a') : dayjs(event.endDate).format('MMMM Do, h:mm a')) : '');
	});

	return props;
});

export const server: ServerDefinition = { identifier: 'Calendar', element: HydratedCalendar };
