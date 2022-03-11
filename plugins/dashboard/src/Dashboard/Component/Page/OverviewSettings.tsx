import { h } from 'preact';
import { useState } from 'preact/hooks';

import Card from '../Card';
import Form, { Field } from '../Form';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';

interface OverviewData {
	name: string;
	address: string;
	description: string;
	favicon: string | null;
	themeColor: string | null;
	visibility: 'visible' | 'hidden';
	money: number;
	percent: number;
}

export default function OverviewSettings() {
	const [data, setData] = useState<OverviewData>({
		name: 'The Shinglemill',
		address: 'www.shinglemill.ca',
		description:
			'The Shinglemill Pub and Bistro is a favourite restaurant for locals and visitors alike, located on pristine Powell Lake.',
		favicon: null,
		themeColor: null,
		visibility: 'visible',
		money: 99999,
		percent: 0.15,
	});

	return (
		<Card>
			<Card.Header
				icon={Icon.home}
				title='Overview'
				subtitle='Basic site appearance, search engine optimization.'
			/>
			<Card.Body>
				<Form class={tw`p-2`} initialValue={data} onSubmit={setData}>
					<div class={tw`flex-(& row) gap-8`}>
						<div class={tw`w-64 shrink-0`}>
							<p class={tw`font-medium mb-1`}>Site Metadata</p>
							<p class={tw`text-gray-300 text-sm`}>
								The basic description of your website.
							</p>
						</div>
						<div class={tw`grow pt-1 flex-(& col) gap-4`}>
							<Field.Text
								path='name'
								description='The name of your website.'
								minLength={3}
								maxLength={32}
							/>
							<Field.Text
								path='address'
								description="Your website's address, e.g. www.example.com"
								pattern={/^(?:[A-z-_]+\.)+[A-z]{2,24}(?:\/?[A-z-_]+)*\/?$/}
								patternHint='Please enter a valid website address.'
							/>
							<Field.Text
								path='description'
								description='A short description of your website, used in search results.'
								optional
								maxLength={512}
							/>
						</div>
					</div>

					<div class={tw`flex-(& row) gap-8 pt-4 mt-6 mb-1`}>
						<div class={tw`w-64 shrink-0`}>
							<p class={tw`font-medium mb-1`}>Site Appearance</p>
							<p class={tw`text-(gray-300 sm)`}>
								Settings that determine how browsers display your website.
							</p>
						</div>
						<div class={tw`grow pt-1 flex-(& col) gap-4`}>
							<Field.Text
								path='favicon'
								label='Favorite Icon'
								description='A small icon for your website, displays on tabs and next to bookmarks.'
								optional
							/>
							<Field.Text
								path='themeColor'
								description='The accent color used for your website, used by some browsers.'
								optional
							/>
							<Field.Option
								path='visibility'
								description='The visibility of your site to search engines.'
								options={{ visible: 'Visible', hidden: 'Hidden' }}
							/>
							{/* <Field.Toggle
								path='visibility'
								label='Allow site to appear in search results'
								description='If your site is not visible to search engines, it will be harder to find.'
							/> */}
						</div>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
}
