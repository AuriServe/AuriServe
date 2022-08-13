import { h } from 'preact';
import { merge } from 'common';
import { useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hydrate, Static } = require('hydrated');

// import as from 'auriserve';

interface Props {
	width?: number;
	speed?: number;
	interval?: number;

	pagination?: "arrows";

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

// const { hydrate, Static } = as.hydrated;

const identifier = 'base:carousel';

function RawCarousel(props: Props) {
	const elemRef = useRef<HTMLDivElement>(null);
	const children = Array.isArray(props.children) ? props.children : [props.children];

	props.speed ??= 200;

	useEffect(() => {
		const elem = elemRef.current!;
		const items = elem.querySelector('.carousel-items')! as HTMLElement;
		const container = items.children[0]! as HTMLElement;

		let active = 0;

		elem.classList.remove('static');
		container.children[0].classList.add('active');
		items.style.height = `${container.children[0].clientHeight}px`;

		let cycling = true;
		let interval: number;

		const observer = new IntersectionObserver((entries) => {
			const intersecting = entries[0].isIntersecting;
			if (intersecting && !interval && cycling) {
				interval = setInterval(() => {
					move(1, 'right', false);
				}, props.interval) as any as number;
			}
			else if (!intersecting && interval && cycling) {
				clearInterval(interval);
				interval = 0;
			}
		}, { threshold: 0.5 });

		observer.observe(elem);

		function move(offset: number, direction: 'left' | 'right', user: boolean) {
			if (user && cycling) {
				clearInterval(interval);
				interval = 0;
				cycling = false;
				observer.disconnect();
			}

			const prevElem = container.children[active] as HTMLElement;
			active = (active + offset + container.children.length * 4) % container.children.length;
			const nextElem = container.children[active] as HTMLElement;

			prevElem.style.transitionDuration = `${props.speed}ms`;
			prevElem.classList.add(direction === 'right' ? 'transition-left' : 'transition-right');
			nextElem.classList.add('active');
			nextElem.classList.add(direction === 'right' ? 'transition-right' : 'transition-left');
			items.style.height = `${nextElem.clientHeight}px`;

			setTimeout(() => {
				requestAnimationFrame(() => {
					nextElem.style.transitionDuration = `${props.speed}ms`;

					requestAnimationFrame(() => {
						nextElem.classList.remove(direction === 'right' ? 'transition-right' : 'transition-left');
					});
				});

				setTimeout(() => {
					nextElem.style.transitionDuration = '';
				}, props.speed);
			}, props.speed! / 2);

			setTimeout(() => {
				prevElem.classList.remove('active');
				prevElem.classList.remove(direction === 'right' ? 'transition-left' : 'transition-right');
				prevElem.style.transitionDuration = '';
			}, props.speed);
		}

		const buttons = Array.prototype.slice.call(elem.querySelectorAll('.button-arrow') as any) as HTMLElement[];

		if (buttons.length) {
			buttons[0].addEventListener('click', () => move(-1, 'left', true));
			buttons[1].addEventListener('click', () => move(1, 'right', true));
		}
	}, [ props.interval, props.speed ]);

	return (
		<div
			ref={elemRef}
			class={merge(identifier, props.class, 'static')}
			style={{
				maxWidth: props.width ? `${props.width}px` : undefined,
				...(props.pagination === 'arrows' ? {
					paddingLeft: 64,
					paddingRight: 64
				} : {}),
				...(props.style ?? {})
			}}
		>
			<div class='carousel-items' style={{ transitionDuration: `${props.speed * 1.5}ms` }}>
				<Static>{children.map((child, i) => <div key={i} class='carousel-item'>{child}</div>)}</Static>
			</div>
			{props.pagination === 'arrows' && <button class='button-arrow' aria-label='Previous'/>}
			{props.pagination === 'arrows' && <button class='button-arrow' aria-label='Next'/>}
		</div>
	);
}

export const Carousel = hydrate(identifier, RawCarousel);

export default { identifier, component: Carousel };
