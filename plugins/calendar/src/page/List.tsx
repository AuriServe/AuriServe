import { h, VNode } from 'preact';
import { merge } from 'common';
import { hydrate, Static } from 'hydrated';
import { useMemo } from 'preact/hooks';

import { populateACAL } from '../dashboard/PopulateCalendar';
import { getEventsInRange, PopulatedEvent } from '../common/Calendar';

const identifier = 'calendar:list';

function getEvents(props: ServerProps): PopulatedEvent[] {
	// eslint-disable-next-line
	const dataPath = require('auriserve').dataPath;
	const start = (props.upcoming ? (Date.now() / 1000) : props.from ?? 0) * 1000;
	const end = props.to ? (props.to / 1000) : ((start || Date.now() / 1000) + (props.span ?? 60 * 60 * 24 * 365)) * 1000;

	// eslint-disable-next-line
	let events = getEventsInRange(populateACAL(JSON.parse(require('fs')
		.readFileSync(`${dataPath}/${props.calendar}`, 'utf8'))), start, end).sort((a, b) => a.start - b.start);

	// eslint-disable-next-line
	const Markdown = (require('markdown-it') as typeof import('markdown-it'))({
		html: false,
		linkify: true,
		breaks: true,
		typographer: true
	});

	events = events.slice(0, props.limit ?? 100);

	events.forEach(event => event.description = Markdown.render(event.description ?? ''));

	return events;
}

interface ServerProps {
	/** The path of the calendar (.acal.json) to use. */
	calendar: string;

	/** The start unix time of events to show, if unset, defaults to 0. Overridden by `upcoming`. */
	from?: number;

	/** Only show events that are currently running / have not yet occured. If unset, falls back to `from`. */
	upcoming?: boolean;

	/** The number of unix seconds from `from` (or now, if `upcoming`) to find events for. Default is 1 year. */
	span?: number;

	/** The end unix time of events to show. Overrides `span` if set. */
	to?: number;

	/** The maximum number of events to show, default 100. */
	limit?: number;

	class?: string;

	/** Children to show if there are no events. */
	children?: VNode;
}

interface ClientProps {
	events: PopulatedEvent[];

	class?: string;
}

function RawList(props: ServerProps | ClientProps) {
	const events = useMemo(() => {
		if ('events' in props) return props.events;
		return getEvents(props);
	}, [ props ]);

	return (
		<div class={merge(identifier, props.class)}>
			{events.length > 0 ? events.map(event => {
				const now = new Date();
				const start = new Date(event.start);
				const end = new Date(event.end);

				const startDateStr = start.toLocaleDateString('en-US', {
					day: 'numeric', month: 'long',
					year: now.getFullYear() !== start.getFullYear() ? 'numeric' : undefined
				});

				const startTimeStr = start.toLocaleTimeString('en-US', {
					hour: 'numeric', minute: 'numeric'
				}).toLowerCase();


				const endDateStr = end.toLocaleString('en-US', {
					day: 'numeric',  month: 'long',
					year: now.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
				});

				const endTimeStr = end.toLocaleString('en-US', {
					hour: 'numeric', minute: 'numeric'
				}).toLowerCase();

				const startSameDateAsEnd = start.getDate() === end.getDate() &&
					start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

				const startTimeDefault = start.getHours() === 0 && start.getMinutes() === 0;
				const endTimeDefault = end.getHours() === 23 && end.getMinutes() === 59;

				return (
					<div key={event.uid} class='event'>
						<div class='image'>
							<p>Placeholder</p>
						</div>
						<div class='title'>{event.title}</div>
						<div class={merge('date_time', startSameDateAsEnd && 'same_date',
							startTimeDefault && 'start_default', endTimeDefault && 'end_default')}>
							<span class='start'>
								<span class='date'>{startDateStr}</span>
								<span class='sep'>, </span>
								<span class='time'>{startTimeStr}</span>
							</span>
							<span class='sep'> - </span>
							<span class='end'>
								<span class='date'>{endDateStr}</span>
								<span class='sep'>, </span>
								<span class='time'>{endTimeStr}</span>
							</span>
						</div>
						<div class='description element-prose' dangerouslySetInnerHTML={{ __html: event.description! }}/>
					</div>
				);
			}) :
				<Static>
					{(props as ServerProps).children}
				</Static>
			}
		</div>
	);
}

const List = hydrate(identifier, RawList, (props: ServerProps): ClientProps => ({
	events: getEvents(props)
}));

export default { identifier, component: List };
