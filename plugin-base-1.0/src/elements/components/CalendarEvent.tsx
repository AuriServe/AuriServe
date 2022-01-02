import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { EventProp } from '../Calendar';

import './CalendarEvent.sss';

import { client as ImageView } from '../ImageView';

interface Props {
	event: EventProp;
	onClose: () => void;
}

export default function CalendarEvent({ event, onClose }: Props) {
	const [ media, setMedia ] = useState<number>(0);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => document.body.style.overflow = '';
	});

	return (
		<div class='CalendarEvent' onClick={onClose}>
			<div class='CalendarEvent-Modal'>
				<div class='CalendarEvent-Wrap' onClick={e => e.stopPropagation()}>
					{event.media && <div class='CalendarEvent-Media'>
						<ImageView.element lightbox={true} protect={true} media={event.media[media]}
							style={{ objectPosition: 'center ' + (event.mediaAttachment ?? 'center') }}/>
						{event.media.length > 1 && <button class='CalendarEvent-MediaNav Left' aria-label='Navigate Left'
							onClick={() => setMedia((media - 1) < 0 ? (event.media!.length - 1) : (media - 1))}>
							<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'>
								<path d='M0 0h24v24H0V0z' fill='none' opacity='.87'/>
								<path fill='white' d={'M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0'
								+ ' 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z'}/>
							</svg>
						</button>}
						{event.media.length > 1 && <button class='CalendarEvent-MediaNav Right' aria-label='Navigate Right'
							onClick={() => setMedia((media + 1) % event.media!.length)}>
							<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'>
								<path d='M24 24H0V0h24v24z' fill='none' opacity='.87'/>
								<path fill='white' d={'M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15'
								+ ' 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z'}/>
							</svg>
						</button>}
					</div>}
					<div class='CalendarEvent-Content'>
						<h4 class='CalendarEvent-Title'>{event.name}</h4>
						<h5 class='CalendarEvent-Date'>{event.hideDate ? 'Date to be determined.' : event.dateString!}</h5>
						<div class='CalendarEvent-Body' dangerouslySetInnerHTML={{__html: event.description }} />
					</div>
				</div>
			</div>
		</div>
	);
}
