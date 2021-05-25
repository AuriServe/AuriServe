import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useRef } from 'preact/hooks';

import './LoginPage.sass';

import Title from '../Title';

type LoginState = 'INPUT' | 'PENDING' | 'AUTH';

interface Props {
	onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
	const userInputRef = useRef<HTMLInputElement>();
	const [ username, setUsername ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');

	const [ state, setState ] = useState<LoginState>('INPUT');
	const [ warning, setWarning ] = useState<string>('');
	
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			if (state === 'PENDING') throw 'Attempt to send request while already logging in.';

			setState('PENDING');
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

			setState('AUTH');
			setTimeout(() => onLogin(), 550);
		}
		catch(err) {
			setState('INPUT');
			setWarning(err);
			setUsername('');
			setPassword('');
			window.requestAnimationFrame(() => userInputRef.current!.select());
		}

		return false;
	};

	return (
		<div class='LoginPage'>
			<Title>Login</Title>
			<div class='LoginPage-Wrap'>
				<form class={'LoginPage-Card ' + state} onSubmit={handleSubmit}>
					<div class='LoginPage-ProfilePlaceholder' role='heading' aria-level='1' aria-label='Log In'>
						<img class='card' src='/admin/asset/icon/account-light.svg' alt=''/>
						<img class='success' src='/admin/asset/icon/serve-light.svg' alt=''/>
					</div>
					<div class='LoginPage-FormContents'>

						<input
							type='text'
							autoComplete='username'
							ref={userInputRef}
							
							autoFocus
							required
							minLength={3}
							maxLength={32}

							aria-label='Username'
							placeholder='Username'
							
							value={username}
							onInput={(evt: any) => setUsername(evt.target.value)}
							onChange={(evt: any) => setUsername(evt.target.value)}

							disabled={state === 'PENDING'}
						/>

						<input
							type='password'
							autoComplete={'current-password'}
							
							required
							minLength={8}
							
							aria-label='Password'
							placeholder='Password'
							
							value={password}
							onInput={(evt: any) => setPassword(evt.target.value)}
							onChange={(evt: any) => setPassword(evt.target.value)}

							disabled={state === 'PENDING'}
						/>

						<button disabled={state === 'PENDING'}>Log In</button>
					</div>
				</form>

				<p class='LoginPage-Warning'>{warning}</p>
			</div>
		</div>
	);
}
