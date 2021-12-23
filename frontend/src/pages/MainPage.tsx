import { h } from 'preact';

import { Page, Title } from '../structure';
import Card from '../Card';

import { Transition, TransitionGroup } from '../Transition';
import { useEffect, useState } from 'preact/hooks';

export default function MainPage() {

	const [ visible, setVisible ] = useState<number>(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setVisible(visible + 1);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [ visible ]);

	return (
		<Page>
			<Title>Home</Title>
			<Card class='mx-auto my-8 max-w-5xl'>
				<Card.Body>
					<h1 class='font-bold text-center text-3xl'>Hello World</h1>
					<div class='flex h-16 mb-2'>
						<div class='w-32'>
							<Transition
								as='div'
								show={visible % 2 === 0}
								duration={500}
								class='bg-neutral-50 w-16 h-16 rounded-lg'
								enter='transition duration-500'
								enterFrom='opacity-0 scale-0 -rotate-90'
								enterTo ='opacity-100 scale-100'
								invertExit
							/>
						</div>
						<div class='w-24'>
							<Transition
								show={visible % 2 === 0}
								duration={500}
								class={visible ? 'scale-150' : ''}
								enter='transition-all duration-500'
								enterFrom='!scale-100 opacity-0'
								invertExit
							>
								<h2>This is text</h2>
							</Transition>
						</div>
					</div>
					<TransitionGroup
						as='div'
						duration={500}
						class='flex gap-2'
						enter='transition duration-500'
						enterFrom='opacity-0 scale-0'
						enterTo ='opacity-100 scale-100'
						invertExit
					>
						{visible % 6 <= 4 && <div key='a' class='w-8 h-8 bg-accent-300 rounded'/>}
						{visible % 6 >= 2 && <div key='b' class='w-8 h-8 bg-accent-500 rounded'/>}
						{(visible % 6 <= 2 || visible % 6 >= 4) && <div key='c' class='w-8 h-8 bg-accent-700 rounded'/>}
					</TransitionGroup>
				</Card.Body>
			</Card>
		</Page>
	);
}
