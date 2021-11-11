import { mergeClasses } from 'common/util';
import { ComponentChildren, h } from 'preact';
import { TransitionGroup, CSSTransition } from 'preact-transitioning';
import { useContext, useRef, useState, useEffect } from 'preact/hooks';

import { FormContext, FormField, InputActivity } from './Type';

import { Portal } from '../structure';
import Description from './Description';

interface Props {
	style?: any;
	class?: string;
	innerClass?: string;

	position: 'right' | 'left' | 'above' | 'below';
	padding?: number;

	children?: (description: string) => ComponentChildren;
}

export default function FloatingDescription(props: Props) {
	const form = useContext(FormContext);
	const containerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const [ field, setField ] = useState<InputActivity | null>(null);

	useEffect(() => {
		let setNullTimeout: any = 0;

		return form.event.bind('activity', (event: InputActivity) => {
			if (event === null) {
				setNullTimeout = setTimeout(() => setField(null), 50);
			}
			else {
				if (setNullTimeout) {
					clearTimeout(setNullTimeout);
					setNullTimeout = 0;
				}
				setField(event);
			}
		});
	}, []);

	useEffect(() => {
		containerRef.current.style.height = (descriptionRef.current?.clientHeight ?? 0) + 'px';
	}, [ field ]);

	const schema = form.schema.fields[field?.name!] as FormField | undefined;

	const top = field?.target ? (Math.floor(field.target.getBoundingClientRect().top
		+ window.scrollY) + 'px') : undefined;
	const left = field?.target ? (Math.floor(field.target.getBoundingClientRect().right
		+ window.scrollX) + (props.padding ?? 4) * 4 + 'px') : undefined;

	return (
		<Portal to={document.querySelector('.AS_ROOT') ?? document.body}>
			<div ref={containerRef} style={{ ...props.style, top, left }}
				class={mergeClasses('isolate absolute z-10 w-80 min-h-[2.5rem] bg-neutral-700 shadow-md rounded transition-all',
					'after:absolute after:-left-1.5 after:top-3.5 after:w-3 after:h-3',
					'after:bg-neutral-700 after:rotate-45', !top && 'hidden', props.class)}>

				<div class='overflow-hidden'>
					<TransitionGroup duration={75}>
						{(schema && schema.description) ? [
							<CSSTransition key={(field?.name ?? '-') + field?.error}
								classNames={{
									appear: 'delay-75 opacity-0 -translate-y-1',
									appearActive: 'delay-75 !opacity-100 !translate-y-0',
									enter: 'delay-75 opacity-0 -translate-y-1',
									enterActive: 'delay-75 !opacity-100 !translate-y-0',
									exit: 'opacity-100 translate-y-0',
									exitActive: '!opacity-0 !translate-y-1'
								}}
							>
								<Description
									ref={descriptionRef} for={field?.name!} error={field!}
									class={mergeClasses('absolute top-0 left-0 w-full transition', props.innerClass)}>
									{props.children}
								</Description>
							</CSSTransition>
						] : []}
					</TransitionGroup>
				</div>
			</div>
		</Portal>
	);
}
