import { ComponentChildren, h } from 'preact';
import { useContext, useRef, useState, useEffect } from 'preact/hooks';

import { TransitionGroup } from '../Transition';

import Svg from '../Svg';
import * as Icon from '../../Icon';
import { FormContext } from './Form';
import { tw, merge } from '../../Twind';
import { elementBounds } from '../../Util';
import { ValidityError } from './useValidity';

interface Props {
	style?: any;
	class?: string;
	innerClass?: string;

	position: 'right' | 'left' | 'above' | 'below';
	padding?: number;

	children?: (description: string) => ComponentChildren;
}

interface State {
	path: string | null;
	description: string | null;
	error: string | null;
	top: string;
	left: string;
}

export default function FloatingDescription(props: Props) {
	const form = useContext(FormContext);
	const containerRef = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<State>({
		path: null,
		description: null,
		error: null,
		top: '',
		left: '',
	});

	useEffect(() => {
		let clearPathTimeout = 0;
		let clearPosTimeout = 0;

		const unbindFocus = form.event.bind('focus', (path, focused) => {
			setState((oldState) => {
				if (!focused && path !== oldState.path) return oldState;

				const meta = form.meta.current[path ?? '-'];
				const description = (meta?.elem?.getAttribute('aria-description') ?? '').replace(
					/\\n/g,
					'\n'
				);

				if (!focused || (!description && !meta?.error)) {
					if (!clearPathTimeout) {
						clearPathTimeout = setTimeout(() => {
							setState((state) => ({
								...state,
								path,
								description: null,
								error: null,
							}));
							clearPathTimeout = 0;
							clearPosTimeout = setTimeout(() => {
								setState((state) => ({ ...state, top: '', left: '' }));
								clearPosTimeout = 0;
							}, 200) as any;
						}, 50) as any;
						return oldState;
					}
				}

				if (clearPathTimeout) {
					clearTimeout(clearPathTimeout);
					clearPathTimeout = 0;
				}
				if (clearPosTimeout) {
					clearTimeout(clearPosTimeout);
					clearPosTimeout = 0;
				}

				if (!meta) return oldState;
				const bounds = elementBounds(meta!.elem!);
				const parentBounds = elementBounds(
					containerRef.current!.offsetParent! as HTMLElement
				);
				return {
					path,
					description,
					error: meta!.error?.message ?? null,
					top: `${Math.floor(bounds.top) - parentBounds.top}px`,
					left: `${
						Math.floor(bounds.left + bounds.width - parentBounds.left) +
						(props.padding ?? 4) * 4
					}px`,
				} as State;
			});
		});

		const unbindValidity = form.event.bind(
			'validity',
			(path: string, error: ValidityError | null) => {
				setState((oldState) => {
					if (oldState.path !== path) return oldState;
					const meta = form.meta.current[path ?? '-'];
					if (!meta) return oldState;
					const bounds = elementBounds(meta!.elem!);
					const parentBounds = elementBounds(
						containerRef.current!.offsetParent! as HTMLElement
					);

					return {
						...oldState,
						top: `${Math.floor(bounds.top - parentBounds.top)}px`,
						left: `${
							Math.floor(bounds.left + bounds.width - parentBounds.left) +
							(props.padding ?? 4) * 4
						}px`,
						error: (error?.visible && error?.message) || null,
					};
				});
			}
		);

		return () => {
			unbindFocus();
			unbindValidity();
			if (clearPathTimeout) clearTimeout(clearPathTimeout);
			if (clearPosTimeout) clearTimeout(clearPosTimeout);
		};
	}, [form, props.padding]);

	const handleUpdateContainerHeight = (ref: HTMLDivElement | null) => {
		if (!ref || !containerRef.current) return;
		containerRef.current.style.height = `${ref.clientHeight ?? 0}px`;
	};

	const show = state.description || state.error;

	return (
		<div
			ref={containerRef}
			style={{ ...props.style, top: state.top, left: state.left }}
			class={merge(
				tw`FloatingDescription~(isolate absolute z-10 w-80 min-h-[2.5rem]
					bg-gray-700 shadow-md rounded transition-all [transform-origin:left_center])
				after:(absolute -left-1.5 top-3.5 w-3 h-3 bg-gray-700 rotate-45)
				${show ? 'delay-75' : 'opacity-0 scale-[98%] interact-none'}`,
				props.class
			)}>
			<div class={tw`overflow-hidden h-full w-full relative`}>
				<TransitionGroup
					duration={175}
					enter={tw`transition delay-75 duration-100 z-10`}
					enterFrom={tw`opacity-0 -translate-y-1`}
					exit={tw`transition duration-100`}
					exitTo={tw`opacity-0 translate-y-1`}>
					{show && (
						<div
							key={`${state.description}-${state.error}`}
							ref={handleUpdateContainerHeight}
							class={merge(tw`absolute top-0 left-0 w-full`, props.innerClass)}>
							{state.description && (
								<div class={tw`flex gap-2 p-2 pr-3 whitespace-pre-line`}>
									<Svg
										src={Icon.info}
										size={6}
										class={tw`shrink-0 icon-p-accent-300 icon-s-gray-600 -mt-px`}
									/>
									{state.description}
								</div>
							)}
							{state.error && (
								<div class={tw`p-2 ${state.description && 'bg-gray-750 rounded-b'}`}>
									<div
										class={tw`flex gap-2 text-accent-300 theme-red whitespace-pre-line`}>
										<Svg
											src={Icon.error}
											size={6}
											class={tw`flex-shrink-0 icon-s-accent-400 icon-p-gray-900 -mt-px`}
										/>
										{state.error}
									</div>
								</div>
							)}
						</div>
					)}
				</TransitionGroup>
			</div>
		</div>
	);
}
