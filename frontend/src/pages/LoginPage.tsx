import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useRef } from 'preact/hooks';

import { Form, Text, Label } from '../input';
import { Title, Page, Card, Button } from '../structure';

import { mergeClasses } from 'common/util';

interface Props {
	onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
	const userInputRef = useRef<HTMLInputElement>();
	const [ username, setUsername ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');

	const [ state, setState ] = useState<'input' | 'pending' | 'auth'>('input');
	const [ warning, setWarning ] = useState<string>('');
	
	const handleSubmit = async () => {
		try {
			if (state === 'pending') throw 'Attempt to send request while already logging in.';

			setState('pending');
			setWarning('');

			const r = await fetch('/admin/auth', {
				method: 'POST', cache: 'no-cache',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					user: username,
					pass: password
				})
			});

			const res = await r.text();
			if (r.status !== 200) throw res;

			Cookie.set('tkn', res, { sameSite: 'Lax' });

			setState('auth');
			setTimeout(() => onLogin(), 450);
		}
		catch(err) {
			setState('input');
			setWarning(err);
			setUsername('');
			setPassword('');
			window.requestAnimationFrame(() => userInputRef.current!.select());
		}
	};

	return (
		<Page class='grid place-items-center grid-rows-[1fr,auto] !pb-0'>
			<Title>Login</Title>
			<Card class={mergeClasses('w-72 mb-16 transition-all duration-200',
				state !== 'input' && '!bg-transparent !border-transparent shadow-none px-0')}>
				<Form onSubmit={handleSubmit}>
					<h1 class='sr-only'>AuriServe</h1>
					<div role='heading' aria-level='2' aria-label='Log In'
						class={mergeClasses('relative transition-all my-4 mx-auto rounded-full bg-gradient-to-tl from-indigo-600 to-blue-500',
							'ring-8 ring-blue-500/50 dark:ring-blue-600/30 select-none duration-300 transition transform',
							state === 'input' ? 'w-2/3 pb-[66.67%]' : 'w-3/4 pb-[75%]', state === 'auth' && 'opacity-0 scale-90 duration-300')}>
						<img src='/admin/asset/icon/account-light.svg' alt=''
							class={mergeClasses('absolute w-full h-full p-8 transition duration-300 transform',
								state === 'input' ? 'opacity-1' : 'opacity-0 scale-75')}/>
						<img src='/admin/asset/icon/serve-light.svg' alt=''
							class={mergeClasses('absolute w-full h-full p-8 transition-all duration-300 transform',
								state === 'input' ? 'opacity-0 scale-75' : 'opacity-1',
								state === 'auth' ? 'left-8 bottom-8 scale-75 delay-75' : 'left-0 bottom-0')}/>
					</div>
					<div class={mergeClasses('flex flex-col overflow-hidden', state === 'input' ? 'max-h-80' : 'max-h-0 opacity-0')}
						style={{ transition: 'max-height 300ms, opacity 200ms' }}>
						<Label label='Username'>
							<Text value={username} onValue={setUsername} enabled={state !== 'pending'}
								completion='username' ref={userInputRef} minLength={3} maxLength={32}/>
						</Label>
						<Label label='Password' class='mb-4'>
							<Text value={password} onValue={setPassword} enabled={state !== 'pending'}
								completion='current-password' minLength={8} obscure/>
						</Label>

						<p class='text-center text-blue-600 -mt-1 mb-3'>{warning}</p>
						<Button type='submit' disabled={state === 'pending'} label='Log In'/>
					</div>
				</Form>
			</Card>
			<div class='bg-gradient-to-r from-gray-800 dark:from-gray-100 via-gray-800 dark:via-gray-100
				to-transparent w-max py-2 pl-4 pr-80 justify-self-start self-end'>
				<p class='text-gray-300 dark:text-gray-600 mt-0.5'>AuriServe 0.0.1&nbsp; &nbsp;&bull;&nbsp; &nbsp;AS Frontend 0.0.1</p>
			</div>
		</Page>
	);
}
