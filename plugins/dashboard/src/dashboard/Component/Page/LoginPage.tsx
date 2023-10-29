import { h } from 'preact';
import { assert } from 'common';
import { useState, useRef } from 'preact/hooks';

import Svg from '../Svg';
import Card from '../Card';
import Form, { Field } from '../Form';
import { PrimaryButton } from '../Button';

import { tw } from '../../Twind';

import icon_user from '@res/icon/users.svg';
import icon_rocket from '@res/icon/launch.svg';

interface Props {
	onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
	const userInputRef = useRef<HTMLElement | null>(null);

	const [state, setState] = useState<'input' | 'pending' | 'auth'>('input');
	const [, setWarning] = useState<string>('');

	const handleSubmit = async ({
		identity,
		password,
	}: {
		identity: string;
		password: string;
	}) => {
		try {
			if (state === 'pending') throw 'Attempt to send request while already logging in.';

			setState('pending');
			setWarning('');

			const r = await fetch('/dashboard/res/auth', {
				method: 'POST',
				cache: 'no-cache',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ identity, password }),
			});

			const res = await r.text();
			if (r.status !== 200) throw res;

			window.localStorage.setItem('token', res);

			setState('auth');
			setTimeout(() => onLogin(), 450);
		} catch (err) {
			assert(typeof err === 'string', 'Error message must be a string.');
			setState('input');
			setWarning(err);
			window.requestAnimationFrame(() =>
				(userInputRef.current! as HTMLInputElement).select()
			);
		}
	};

	return (
		<div class={tw`grid grid-rows-[1fr_max-content] !pb-0`}>
			<div class={tw`grid place-items-center`}>
				<Card
					class={tw`w-17 mb-16 transition-all duration-200
						${state !== 'input' && '!bg-transparent !border-transparent shadow-none'}`}>
					<Card.Body class={tw`p-0`}>
						<h1 class={tw`sr-only`}>AuriServe</h1>
						<div
							role='heading'
							aria-level={2}
							aria-label='Log In'
							class={tw`
								relative mt-10 mb-6 mx-auto rounded-full
								bg-gradient-to-tl from-accent-600 to-accent-500
								ring-(8 accent-(500/50 dark:600/30)) interact-none transition-all duration-300 transform
								${state === 'input' ? 'w-3/5 pb-[calc(3/5*100%)]' : 'w-4/5 pb-[calc(4/5*100%)]'}
								${state === 'auth' && 'opacity-0 scale-90'}`}>
							<Svg
								src={icon_user}
								class={tw`
									absolute w-[calc(100%-4rem)] h-[calc(100%-4rem)] icon-p-accent-200 icon-s-accent-400 p-8
									transition-all duration-300 transform
									${state !== 'input' && 'opacity-0 scale-50'}`}
							/>
							<Svg
								src={icon_rocket}
								alt=''
								class={tw`
									absolute w-[calc(100%-4rem)] h-[calc(100%-4rem)] icon-p-accent-200 icon-s-accent-400 p-8
									transition-all duration-300 transform
									${state === 'input' && 'opacity-0 scale-50'}
									${state === 'auth' ? 'left-8 bottom-8 scale-75 delay-75' : 'left-0 bottom-0'}`}
							/>
						</div>
						<div
							class={tw`flex-(& col) p-4 overflow-hidden
								[transition:max-height_300ms,opacity_200ms]
								${state === 'input' ? 'max-h-80' : 'max-h-0 opacity-0'}`}>
							<Form<{ identity: string; password: string }>
								class={tw`flex-(& col) gap-y-4`}
								initialValue={{ identity: '', password: '' }}
								onSubmit={handleSubmit}
								description='none'
							>
								<Field.Text
									fieldRef={userInputRef}
									path='identity'
									label='Username or Email'
									description='Please enter your username or a linked email address.'
									completion='username'
									minLength={3}
									maxLength={32}
								/>
								<Field.Password
									path='password'
									description='Please enter your password'
									completion='current-password'
									minLength={8}
								/>

								<PrimaryButton
									type='submit'
									size={12}
									class={tw`!w-full mt-4`}
									disabled={state === 'pending'}
									label='Log In'
								/>
							</Form>
						</div>
					</Card.Body>
				</Card>
			</div>
			<div
				class={tw`bg-gradient-to-r from-gray-(100 dark:800) via-gray-(100 dark:800) to-transparent
					w-max py-2 pl-4 pr-80 justify-self-start self-end`}>
				<p class={tw`text-gray-(600 dark:300) mt-0.5`}>
					AuriServe 0.0.1&nbsp; &nbsp;&bull;&nbsp; &nbsp;AS Frontend 0.0.1
				</p>
			</div>
		</div>
	);
}
