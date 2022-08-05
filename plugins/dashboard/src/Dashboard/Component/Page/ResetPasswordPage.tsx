import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useNavigate, useParams } from 'react-router-dom';

// import Svg from '../Svg';
import Page from './Page';
import Card from '../Card';
import Button from '../Button';
import * as Icon from '../../Icon';
import { Form, PasswordField } from '../Form';

import { tw } from '../../Twind';

// import * as Icon from '../../Icon';

interface Props {
	onReset: () => void;
}

export default function ResetPasswordPage(props: Props) {
	const [ state, setState ] = useState<'input' | 'pending'>('input');

	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();

	async function handleSubmit({ password }: { password: string }) {
		setState('pending');

		const r = await fetch('/dashboard/res/reset_password', {
			method: 'POST',
			cache: 'no-cache',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, password }),
		});

		const res = await r.text();
		if (r.status !== 200) throw res;

		window.localStorage.setItem('token', res);
		props.onReset();
		navigate('/');
	}

	return (
		<Page>
			<div class={tw`flex items-center justify-center`}>
				<Card>
					<Card.Header title='Reset Password' icon={Icon.asterisk}/>
					<Card.Body class={tw`p-12`}>
						<Form disabled={state !== 'input'} initialValue={{ password: '' }} onSubmit={handleSubmit}
							class={tw`flex-(& col) items-stretch gap-4`}>
							<PasswordField
								path='password'
								label='New Password'
								autofocus
								completion='new-password'
								minLength={8}
								pattern={/^.+(?=[0-9])+.+(?=[^\w\d\s])+.+$/}
								patternHint='Please meet the password requirements.'
							/>
							<p class={tw`text-(sm gray-300) w-80`}>
								Password must be at least 8 characters long, and include at least one number and special character.
							</p>
							<Button.Secondary type='submit' size={12} class={tw`w-auto mx-12`} label='Reset Password'/>
						</Form>
					</Card.Body>
				</Card>
			</div>
		</Page>
	);
}
