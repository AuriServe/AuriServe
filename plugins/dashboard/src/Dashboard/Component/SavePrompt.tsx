import { h } from 'preact';
import { usePrevious } from 'vibin-hooks';
import { useMemo, useRef, useState } from 'preact/hooks';

import Svg from './Svg';
import Card from './Card';
import Button from './Button';
import Portal from './Portal';
import Spinner from './Spinner';
import Transition from './Transition';

import { tw } from '../Twind';
import * as Icon from '../Icon';

interface Props {
	dirty: boolean;
	saving: boolean;
	onSave: () => void;
	onUndo?: () => void;
}

export function SavePrompt(props: Props) {
	const hideTimeout = useRef<number>(0);
	// const lastState = usePrevious(props.state);

	const [state, setState] = useState<'unsaved' | 'saving' | 'saved' | 'closed'>(
		props.dirty ? 'unsaved' : 'closed'
	);
	const [active, setActive] = useState<boolean>(state !== 'saved' && state !== 'closed');

	const lastSaving = usePrevious(props.saving);
	useMemo(() => {
		if (props.dirty) {
			if (state !== 'saved') {
				if (hideTimeout.current) {
					clearTimeout(hideTimeout.current);
					hideTimeout.current = 0;
				}
				if (props.saving) setState('saving');
				else setState('unsaved');
				setActive(true);
			}
		} else if (lastSaving) {
			if (hideTimeout.current) {
				clearTimeout(hideTimeout.current);
				hideTimeout.current = 0;
			}
			hideTimeout.current = setTimeout(() => {
				setActive(false);
				hideTimeout.current = setTimeout(() => {
					setState(props.dirty ? (props.saving ? 'saving' : 'unsaved') : 'closed');
				}, 200) as any;
			}, 500) as any;
			setState('saved');
		} else if (state !== 'saved') {
			setState('closed');
			setActive(false);
		}
	}, [state, props.dirty, props.saving, lastSaving]);

	return (
		<Portal
			wrapperClass={tw`top-auto left-14 -bottom-8 w-[calc(100%-3.5rem)] h-max interact-none z-40 isolate`}>
			<Transition
				show={active}
				duration={150}
				as='div'
				initial={false}
				enter={tw`transition duration-150`}
				enterFrom={tw`opacity-0 translate-y-1`}
				exit={tw`transition duration-150`}
				exitTo={tw`opacity-0 translate-y-1`}
				class={tw`pt-8 pb-12 bg-gradient-to-b from-transparent via-gray-900 to-gray-900 will-change-transform`}>
				<Card
					class={tw`bg-gray-400 w-max mx-auto interact-auto rounded-md border-(2 gray-900) shadow-(md gray-900) will-change-transform`}>
					<Card.Body class={tw`relative p-2.5`}>
						{/** Content wrap. */}
						<div
							class={tw`flex gap-3 transition-all duration-300 ${
								state === 'unsaved' || state === 'closed'
									? props.onUndo
										? 'pr-36'
										: 'pr-20'
									: 'px-8 justify-center'
							}`}>
							{/** Left indicator. */}
							<div
								class={tw`w-10 h-10 relative bg-gray-700 transition-all duration-200 delay-75 ease-out
								${state === 'unsaved' || state === 'closed' ? 'rounded' : 'rounded-[50%]'}`}>
								{/** Info icon if unsaved. */}
								<Transition
									duration={250}
									show={state === 'unsaved' || state === 'closed'}
									class={tw`absolute inset-0 p-2`}
									enter={tw`transition duration-150 delay-100`}
									enterFrom={tw`opacity-0 scale-80`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 scale-80`}
									as={Svg}
									size={6}
									src={Icon.info}
								/>
								{/** Loading spinner if saving. */}
								<Transition
									duration={400}
									show={state === 'saving'}
									class={tw`absolute inset-1 !animate-none`}
									enter={tw`transition duration-300 delay-100`}
									enterFrom={tw`opacity-0 scale-0`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 scale-0`}
									as={Spinner}
									size={8}
								/>
								{/** Checkmark if saved. */}
								<Transition
									duration={250}
									show={state === 'saved'}
									class={tw`absolute inset-0 p-1.5 icon-p-accent-300 icon-s-gray-500`}
									enter={tw`transition duration-150 delay-100`}
									enterFrom={tw`opacity-0 scale-80 translate-y-2`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 scale-80 translate-y-2`}
									as={Svg}
									size={7}
									src={Icon.check}
								/>
							</div>

							{/** Text message. */}
							<div
								class={tw`relative transition-all duration-300
									${state === 'unsaved' || state === 'closed' ? 'w-64' : 'w-18'}`}>
								{/** Message if unsaved. */}
								<Transition
									as='div'
									duration={250}
									show={state === 'unsaved' || state === 'closed'}
									class={tw`w-full h-full absolute top-0 bottom-0 left-0`}
									enter={tw`transition duration-150 delay-100`}
									enterFrom={tw`opacity-0 -translate-y-0.5`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 translate-y-0.5`}>
									<p
										class={tw`text-gray-100 font-medium leading-none whitespace-nowrap
										pt-px absolute top-1/2 -translate-y-1/2`}>
										You have unsaved changes.
									</p>
								</Transition>
								{/** Message if saving. */}
								<Transition
									as='div'
									duration={250}
									show={state === 'saving'}
									class={tw`w-full h-full absolute top-0 bottom-0 left-0`}
									enter={tw`transition duration-150 delay-100`}
									enterFrom={tw`opacity-0 -translate-y-0.5`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 -translate-y-0.5`}>
									<p
										class={tw`text-gray-200 font-medium leading-none whitespace-nowrap
										pt-px absolute top-1/2 -translate-y-1/2`}>
										Saving...
									</p>
								</Transition>
								{/** Message if saved. */}
								<Transition
									as='div'
									duration={250}
									show={state === 'saved'}
									class={tw`w-full h-full absolute top-0 bottom-0 left-0`}
									enter={tw`transition duration-150 delay-100`}
									enterFrom={tw`opacity-0 translate-y-0.5`}
									exit={tw`transition duration-150`}
									exitTo={tw`opacity-0 -translate-y-0.5`}>
									<p
										class={tw`text-accent-300 font-medium leading-none whitespace-nowrap
										pt-px absolute top-1/2 -translate-y-1/2`}>
										Saved!
									</p>
								</Transition>
							</div>
						</div>
						{/** Button wrap. */}
						<div
							class={tw`absolute top-2.5 right-2.5 flex-(& row-reverse) gap-2.5 transition duration-150
							${state !== 'unsaved' && state !== 'closed' && 'opacity-0 scale-95 translate-x-4'}`}>
							<Button.Secondary
								icon={Icon.save}
								label='Save'
								onClick={props.onSave}
								disabled={state !== 'unsaved'}
								class={tw`!pr-3.5 !pl-2.5 !icon-p-accent-200 !icon-s-accent-500`}
							/>
							{props.onUndo && (
								<Button.Tertiary
									label='Undo'
									disabled={state !== 'unsaved'}
									onClick={props.onUndo}
									class={tw`!pl-4 !pr-3.5`}
								/>
							)}
						</div>
					</Card.Body>
				</Card>
			</Transition>
		</Portal>
	);
}
