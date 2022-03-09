import { ComponentChildren, h } from 'preact';
import { useContext, useRef, useState, useEffect } from 'preact/hooks';

import Portal from '../Portal';
import { TransitionGroup } from '../Transition';

import Svg from '../Svg';
import * as Icon from '../../Icon';
import { FormContext } from './Types';
import { tw, merge } from '../../Twind';

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

	const [path, setPath] = useState<string | null>(null);
	// const [state, setState] = useState<{ name: string; error: ErrorType | null } | null>(
	// 	null
	// );

	useEffect(() => {
		let setNullTimeout: any = 0;

		const unbindFocus = form.event.bind('focus', (path: string | null) => {
			if (path === null) {
				setNullTimeout = setTimeout(() => setPath(null), 50);
			} else {
				if (setNullTimeout) {
					clearTimeout(setNullTimeout);
					setNullTimeout = 0;
				}

				setPath(path);
				// setState({ name: field, /*error: form.fields[field].error*/ });
			}
		});

		// const unbindValidity = form.event.bind('validity', (field: string) => {
		// 	setState((state) => {
		// 		if (state?.name !== field) return state;
		// 		return { name: field, error: form.fields[field].error };
		// 	});
		// });

		return () => {
			unbindFocus();
			// unbindValidity();
		};
	}, [form]);

	const handleUpdateContainerHeight = (ref: HTMLDivElement | null) => {
		if (!ref || !containerRef.current) return;
		containerRef.current.style.height = `${ref.clientHeight}px`;
	};

	// const ref = form.fields[state?.name ?? '']?.ref as HTMLElement | undefined;
	// const schema = form.schema.fields[state?.name ?? ''] as FormField | undefined;
	const ref = path ? form.refs.current[path] : null;
	const posRef = useRef<{ top: string; left: string }>({ top: '', left: '' });

	const description = ref?.getAttribute('aria-description') ?? '';

	if (ref) {
		posRef.current.top = `${Math.floor(
			ref.getBoundingClientRect().top + window.scrollY
		)}px`;
		posRef.current.left = `${
			Math.floor(ref.getBoundingClientRect().right + window.scrollX) +
			(props.padding ?? 4) * 4
		}px`;
	}

	return (
		<Portal wrapperClass={tw`absolute`}>
			<div
				ref={containerRef}
				style={{ ...props.style, top: posRef.current.top, left: posRef.current.left }}
				class={merge(
					tw`FloatingDescription~(isolate absolute z-10 w-80 min-h-[2.5rem]
						bg-gray-700 shadow-md rounded transition-all [transform-origin:left_center])
					after:(absolute -left-1.5 top-3.5 w-3 h-3 bg-gray-700 rotate-45)
					${!ref && 'opacity-0 scale-[98%]'}`,
					props.class
				)}>
				<div class={tw`overflow-hidden h-full w-full relative`}>
					<TransitionGroup
						duration={175}
						enter={tw`transition delay-75 duration-100 z-10`}
						enterFrom={tw`opacity-0 -translate-y-1`}
						exit={tw`transition duration-100`}
						exitTo={tw`opacity-0 translate-y-1`}>
						{description && (
							<div
								key={path ?? '-'}
								ref={handleUpdateContainerHeight}
								class={merge(tw`absolute top-0 left-0 w-full`, props.innerClass)}>
								<div class={tw`flex gap-2 p-2 pr-3 whitespace-pre-line`}>
									<Svg
										src={Icon.info}
										size={6}
										class={tw`shrink-0 icon-p-accent-300 icon-s-gray-600 -mt-px`}
									/>
									{description}
								</div>
								{/* {error && (
									<div class={tw`p-2 bg-gray-750 rounded-b`}>
										<div class={tw`flex gap-2 text-accent-300 theme-red whitespace-pre-line`}>
											<Svg
												src={icon_error}
												size={6}
												class={tw`flex-shrink-0 icon-s-accent-400 icon-p-gray-900 -mt-px`}
											/>
											{error.errorMessage ?? error.error}
										</div>
									</div>
								)} */}
							</div>
						)}
					</TransitionGroup>
				</div>
			</div>
		</Portal>
	);
}
