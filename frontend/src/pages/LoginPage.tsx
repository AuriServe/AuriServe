import { h } from 'preact';
import Cookie from 'js-cookie';
import { useState, useRef } from 'preact/hooks';

import Svg from '../Svg';
import { Secondary as Button } from '../Button';
import { Title, Page, Card } from '../structure';
import { Form, FormSchema, Input } from '../Form';

import { assert, merge } from 'common';

import icon_user from '@res/icon/users.svg';
import icon_rocket from '@res/icon/launch.svg';

interface Props {
	onLogin: () => void;
}

const FORM_SCHEMA: FormSchema = {
	fields: {
		username: {
			type: 'text',
			completion: 'username',
			validation: {
				minLength: 3,
				maxLength: 32,
			},
		},
		password: {
			type: 'password',
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
	const [warning, setWarning] = useState<string>('');

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

			const r = await fetch('/admin/auth', {
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
		<Page class='grid place-items-center grid-rows-[1fr,auto] !pb-0'>
			<Title>Login</Title>
			<Card
				class={merge(
					'w-72 mb-16 !p-0 transition-all duration-200',
					state !== 'input' && '!bg-transparent !border-transparent shadow-none px-0'
				)}>
				<h1 class='sr-only'>AuriServe</h1>
				<div
					role='heading'
					aria-level='2'
					aria-label='Log In'
					class={merge(
						'relative transition-all mt-10 mb-6 mx-auto rounded-full bg-gradient-to-tl from-indigo-600 to-blue-500',
						'ring-8 ring-blue-500/50 dark:ring-blue-600/30 select-none duration-300 transition-all transform',
						state === 'input' ? 'w-3/5 pb-[calc(3/5*100%)]' : 'w-4/5 pb-[calc(4/5*100%)]',
						state === 'auth' && 'opacity-0 scale-90 duration-300'
					)}>
					<Svg
						src={icon_user}
						class={merge(
							'absolute w-[calc(100%-4rem)] h-[calc(100%-4rem)] icon-p-accent-200 icon-s-accent-400 p-8',
							'transition-all duration-300 transform',
							state !== 'input' && 'opacity-0 scale-50'
						)}
					/>
					<Svg
						src={icon_rocket}
						alt=''
						class={merge(
							'absolute w-[calc(100%-4rem)] h-[calc(100%-4rem)] icon-p-accent-200 icon-s-accent-400 p-8',
							'transition-all duration-300 transform',
							state === 'input' && 'opacity-0 scale-50',
							state === 'auth' ? 'left-8 bottom-8 scale-75 delay-75' : 'left-0 bottom-0'
						)}
					/>
				</div>
				<div
					class={merge(
						'flex flex-col overflow-hidden p-4',
						state === 'input' ? 'max-h-80' : 'max-h-0 opacity-0'
					)}
					style={{ transition: 'max-height 300ms, opacity 200ms' }}>
					<Form
						class='flex flex-col gap-y-4'
						schema={FORM_SCHEMA}
						onSubmit={handleSubmit}>
						<Input for='username' />
						<Input for='password' />

						{/* <p class='text-center text-blue-600 -mt-1 mb-3'>{warning}</p> */}
						<Button
							size={12}
							class='w-full mt-4'
							type='submit'
							disabled={state === 'pending'}
							label='Log In'
						/>
					</Form>
				</div>
			</Card>
			<div
				class='bg-gradient-to-r from-neutral-100 dark:from-neutral-800 via-neutral-100 dark:via-neutral-800
				to-transparent w-max py-2 pl-4 pr-80 justify-self-start self-end'>
				<p class='text-neutral-600 dark:text-neutral-300 mt-0.5'>
					AuriServe 0.0.1&nbsp; &nbsp;&bull;&nbsp; &nbsp;AS Frontend 0.0.1
				</p>
			</div>
		</Page>
	);
}
