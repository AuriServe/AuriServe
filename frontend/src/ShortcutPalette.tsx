import { h } from 'preact';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import Svg from './Svg';
import { Modal } from './structure';
import { Transition, TransitionGroup } from './Transition';

import { merge } from 'common/util';
import { Shortcut, searchShortcuts } from './Shortcut';

import icon_launch from '@res/icon/launch.svg';
import icon_target from '@res/icon/target.svg';

export let togglePalette: () => void;

function useThrottle(cb: (...values: any[]) => void, rate: number, ...values: any[]) {
	const timeout = useRef<number>(0);
	const changed = useRef<boolean>(false);
	const valuesRef = useRef<any[]>(values);
	valuesRef.current = values;

	useEffect(() => {
		changed.current = true;
		if (timeout.current === 0) {
			timeout.current = setTimeout(() => {
				timeout.current = 0;
				if (changed.current) cb(...valuesRef.current);
			}, rate) as any;
		}
	}, [...values, cb, rate]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = 0;
	}, [cb]);
}

export default function ShortcutPalette() {
	const history = useHistory();

	const inputRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState<string>('');
	const [active, setActive] = useState<number>(0);
	const [results, setResults] = useState<Shortcut[]>([]);
	const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

	useEffect(() => {
		setQuery('');
		inputRef.current?.focus();
	}, [open]);

	useEffect(() => {
		togglePalette = () => setOpen((open) => !open);

		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.code === 'KeyK' && e.ctrlKey) || e.code === 'Escape' || (e.code === 'KeyP' && e.ctrlKey && e.shiftKey)) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				setOpen((open) => !open);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	useThrottle(
		useCallback((query) => {
			if (query.length === 0) {
				setResults([]);
				setNoResultsFound(false);
			} else {
				const results = searchShortcuts(query.toLowerCase());
				setResults(results);
				setNoResultsFound(results.length === 0);
			}
		}, []),
		200,
		query
	);

	useLayoutEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				setActive((active) => {
					let ind = (active + (e.code === 'ArrowDown' ? 1 : -1)) % results.length;
					if (ind < 0) ind += results.length;
					return ind;
				});
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			setActive(0);
		};
	}, [...results, results.length]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleTriggerAction = (ind: number) => {
		results[ind]?.action({ history });
		setOpen(false);
	};

	const handleSubmit = (evt: any) => {
		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		handleTriggerAction(active);
	};

	return (
		<Modal
			active={open}
			onClose={() => setOpen(false)}
			class='!bg-transparent dark:!bg-transparent !shadow-none pointer-events-none'>
			<form class='w-screen max-w-lg h-[32rem] pb-16' onSubmit={(evt) => handleSubmit(evt)}>
				<div class='relative'>
					<label for='shortcut_input' class='sr-only'>
						Search Shortcuts
					</label>
					<input
						id='shortcut_input'
						ref={inputRef}
						class='p-4 w-full bg-neutral-700 rounded-lg mb-4 !outline-none shadow-md pointer-events-auto pl-14'
						type='text'
						placeholder=''
						autofocus
						value={query}
						onInput={(e: any) => setQuery(e.target.value)}
					/>
					<Svg
						size={7}
						src={icon_launch}
						class='absolute top-3.5 left-3.5 interact-none
						icon-p-neutral-100 icon-s-neutral-300'
					/>
				</div>

				<div class='relative'>
					<Transition
						show={results.length === 0 && !noResultsFound}
						duration={300}
						invertExit
						as='div'
						class='absolute will-change-transform top-0 left-0 w-full flex py-2 justify-center items-center gap-2'
						enter='transition-all duration-150 delay-150'
						exit='transition-all duration-150 delay-0'
						enterFrom='opacity-0 scale-90'
						enterTo='opacity-100'>
						<Svg src={icon_target} size={6} />
						<p class='leading-none mt-px text-neutral-200 font-medium interact-none'>Search to get started.</p>
					</Transition>

					<Transition
						show={noResultsFound}
						duration={300}
						invertExit
						as='div'
						class='absolute will-change-transform top-0 left-0 w-full flex py-2 justify-center items-center gap-2'
						enter='transition-all duration-150 delay-150'
						exit='transition-all duration-150 delay-0'
						enterFrom='opacity-0 scale-90'
						enterTo='opacity-100'>
						<Svg src={icon_target} size={6} />
						<p class='leading-none mt-px text-neutral-200 font-medium interact-none'>No results found.</p>
					</Transition>

					<div
						class={merge(
							'relative group h-auto w-full max-h-[calc(7*14*4px+16px)] p-2 pointer-events-auto',
							'bg-neutral-750 shadow-md rounded-lg transition-all overflow-hidden [transform-origin:center_-128px]',
							results.length === 0 && '!py-0 opacity-0 scale-95'
						)}>
						<TransitionGroup
							duration={300}
							enter='transition-all duration-300'
							enterFrom='opacity-0 -mb-14'
							enterTo='opacity-100 mb-0'
							invertExit>
							{results.map((s, i) => (
								<button
									key={`${s.title}_${i}`}
									type='button'
									onClick={() => handleTriggerAction(i)}
									class={merge(
										'flex w-full text-left gap-4 p-2 rounded-md',
										'!outline-none hover:!bg-neutral-600/50 active:!bg-neutral-600',
										active === i && 'bg-neutral-600/50 group-hover:bg-neutral-600/30'
									)}>
									{s.icon && <Svg class='w-6 h-6 rounded bg-neutral-600 p-2' src={s.icon} />}
									<div class='flex flex-col self-center'>
										<p class='truncate leading-none font-medium'>{s.title}</p>
										{s.description && (
											<p class='truncate leading-none text-neutral-200 text-sm pt-1'>{s.description}</p>
										)}
									</div>
								</button>
							))}
						</TransitionGroup>
					</div>
				</div>
			</form>
		</Modal>
	);
}
