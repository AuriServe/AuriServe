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
import Svg from '../Svg';

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
				<Card class={tw`overflow-hidden max-w-lg`}>
					{/* <Card.Header title='Reset Password' icon={Icon.asterisk}/> */}
					<Card.Body class={tw`p-0`}>
						<Form
							disabled={state !== 'input'}
							initialValue={{ password: '' }}
							onSubmit={handleSubmit}
								// class={tw`flex-(& col) items-stretch gap-4`}>
						>
							<div class={tw`flex gap-5 p-5`}>
								<Svg src={Icon.asterisk} size={7}
									class={tw`icon-p-gray-100 icon-s-gray-400 bg-gray-700 rounded-lg p-2 shrink-0`} />
								<div class={tw`flex-(& col)`}>
									<p class={tw`text-gray-100 font-medium mb-1.5`}>Reset Password</p>
									<p class={tw`text-(sm gray-300)`}>Password must be at least 8 characters long, and include a number and a special character.</p>
									<PasswordField
										path='password'
										label='New Password'
										autofocus
										completion='new-password'
										minLength={8}
										pattern={/^.+(?=[0-9])+.+(?=[^\w\d\s])+.+$/}
										patternHint='Please meet the password requirements.'
										class={tw`mt-4`}
									/>
								</div>
							</div>
							<div class={tw`bg-gray-750 flex justify-end py-3.5 px-5`}>
								<Button.Secondary type='submit' icon={Icon.arrow_circle_right} iconRight label='Reset Password'/>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</div>
		</Page>
	);
}
