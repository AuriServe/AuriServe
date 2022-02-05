import { ComponentChildren, h } from 'preact';
import { useContext, useRef, useState, useEffect } from 'preact/hooks';

import { Portal } from '../structure';
import Description from './Description';
import { TransitionGroup } from '../Transition';

import { tw, merge } from '../Twind';
import { ErrorType, FormContext, FormField } from './Type';

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

	const [state, setState] = useState<{ name: string; error: ErrorType | null } | null>(
		null
	);

	useEffect(() => {
		let setNullTimeout: any = 0;

		const unbindFocus = form.event.bind('focus', (field: string | null) => {
			if (field === null) {
				setNullTimeout = setTimeout(() => setState(null), 50);
			} else {
				if (setNullTimeout) {
					clearTimeout(setNullTimeout);
					setNullTimeout = 0;
				}

				setState({ name: field, error: form.fields[field].error });
			}
		});

		const unbindValidity = form.event.bind('validity', (field: string) => {
			setState((state) => {
				if (state?.name !== field) return state;
				return { name: field, error: form.fields[field].error };
			});
		});

		return () => {
			unbindFocus();
			unbindValidity();
		};
	}, [form]);

	const handleUpdateContainerHeight = (ref: HTMLDivElement | null) => {
		if (!ref || !containerRef.current) return;
		containerRef.current.style.height = `${ref.clientHeight}px`;
	};

	const ref = form.fields[state?.name ?? '']?.ref as HTMLElement | undefined;
	const schema = form.schema.fields[state?.name ?? ''] as FormField | undefined;

	const posRef = useRef<{ top: string; left: string }>({ top: '', left: '' });

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
		<Portal to={document.querySelector('.AS_ROOT') ?? document.body}>
			<div
				ref={containerRef}
				style={{ ...props.style, top: posRef.current.top, left: posRef.current.left }}
				class={merge(
					tw`
					isolate absolute z-10 w-80 min-h-[2.5rem] bg-gray-700 shadow-md rounded transition-all
					after:(absolute -left-1.5 top-3.5 w-3 h-3 bg-gray-700 rotate-45) [transform-origin:left_center]
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
						{schema && schema.description && (
							<Description
								key={(state?.name ?? '-') + state?.error}
								ref={handleUpdateContainerHeight}
								for={state!.name}
								_manual={true}
								class={merge(tw`absolute top-0 left-0 w-full`, props.innerClass)}>
								{props.children}
							</Description>
						)}
					</TransitionGroup>
				</div>
			</div>
		</Portal>
	);
}
