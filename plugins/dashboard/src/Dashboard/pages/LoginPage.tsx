import { h } from 'preact';
import Cookie from 'js-cookie';
import { assert } from 'common';
import { useState, useRef } from 'preact/hooks';

import Svg from '../Svg';
import Card from '../Card';
import { PrimaryButton } from '../Button';
import { Title, Page } from '../structure';
import { FloatingDescription, Form, FormSchema, Input } from '../Form';

import { tw } from '../Twind';

import icon_user from '@res/icon/users.svg';
import icon_rocket from '@res/icon/launch.svg';

interface Props {
	onLogin: () => void;
}

const FORM_SCHEMA: FormSchema = {
	fields: {
		username: {
			type: 'text',
			description: 'Please enter your username.',
			completion: 'username',
			validation: {
				minLength: 3,
				maxLength: 32,
			},
		},
		password: {
			type: 'password',
			description: 'Please enter your password.',
			completion: 'current-password',
			validation: {
				minLength: 8,
			},
		},
	},
};

export default function LoginPage({ onLogin }: Props) {
	const userInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

	const [state, setState] = useState<'input' | 'pending' | 'auth'>('input');
	const [, setWarning] = useState<string>('');

	const handleSubmit = async ({
		username,
		password,
	}: {
		username: string;
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
				body: JSON.stringify({
					user: username,
					pass: password,
				}),
			});

			const res = await r.text();
			if (r.status !== 200) throw res;

			Cookie.set('tkn', res, { sameSite: 'Lax' });

			setState('auth');
			setTimeout(() => onLogin(), 450);
		} catch (err) {
			assert(typeof err === 'string', 'Error message must be a string.');
			setState('input');
			setWarning(err);
			window.requestAnimationFrame(() => userInputRef.current!.select());
		}
	};

	return (
		<Page class={tw`grid grid-rows-[1fr_max-content] !pb-0`}>
			<div class={tw`grid place-items-center`}>
				<Title>Login</Title>
				<Card
					class={tw`w-17 mb-16 transition-all duration-200
						${state !== 'input' && '!bg-transparent !border-transparent shadow-none'}`}>
					<Card.Body class={tw`p-0`}>
						<h1 class={tw`sr-only`}>AuriServe</h1>
						<div
							role='heading'
							aria-level='2'
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
							<Form
								class={tw`flex-(& col) gap-y-4`}
								schema={FORM_SCHEMA}
								onSubmit={handleSubmit}>
								<Input for='username' />
								<Input for='password' />

								<FloatingDescription class={tw`w-80`} position='right' />

								{/* <p class='text-center text-blue-600 -mt-1 mb-3'>{warning}</p> */}
								<PrimaryButton
									size={12}
									class={tw`!w-full mt-4`}
									type='submit'
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
		</Page>
	);
}
