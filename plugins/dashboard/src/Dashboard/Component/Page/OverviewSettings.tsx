import { h } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

import Card from '../Card';
import { FormSchema, Form, Input, FloatingDescription } from '../Form';

import { tw } from '../../Twind';

import icon_overview from '@res/icon/home.svg';

const FORM_SCHEMA: FormSchema = {
	fields: {
		name: {
			type: 'text',
			description: 'The name of your website.',
			default: 'The Shinglemill',
			validation: {
				minLength: 3,
				maxLength: 32,
			},
		},
		address: {
			type: 'text',
			description: "Your website's address,\ne.g. www.example.com",
			default: 'www.shinglemill.ca',
			validation: {
				pattern: /^(?:[A-z-_]+\.)+[A-z]{2,24}(?:\/?[A-z-_]+)*\/?$/,
				patternHint: 'Please enter a valid website address.',
			},
		},
		description: {
			type: 'text',
			description: 'A short description of your website, used in search results.',
			default:
				'The Shinglemill Pub and Bistro is a favourite restaurant for locals and visitors alike, located on pristine Powell Lake.',
			multiline: true,
			minRows: 3,
			validation: {
				optional: true,
				maxLength: 512,
			},
		},
		favicon: {
			type: 'text',
			label: 'Favorite Icon',
			description:
				'A small icon for your website, displays on tabs and next to bookmarks.',
			validation: {
				optional: true,
				type: ['png', 'svg', 'jpg', 'svg', 'gif'],
			},
		},
		themeColor: {
			type: 'text',
			label: 'Accent Color',
			description: 'The accent color used for your website, used by some browsers.',
			validation: {
				optional: true,
			},
		},
		visibility: {
			type: 'option',
			label: 'Site Visibility',
			description: 'The visibility of your site to search engines.',
			options: {
				visible: 'Visible',
				hidden: 'Hidden',
			},
		},
		toggle: {
			type: 'toggle',
			label: 'Toggle option demo',
			description: '',
		},
	},
};

export default function OverviewSettings() {
	const data = useRef<any>({});

	const handleSubmit = useCallback(() => {
		console.log(data);
	}, []);

	return (
		<Card>
			<Card.Header
				icon={icon_overview}
				title='Overview'
				subtitle='Basic site appearance, search engine optimization.'
			/>
			<Card.Body>
				<Form ref={data} schema={FORM_SCHEMA} class={tw`p-2`} onSubmit={handleSubmit}>
					<div class={tw`flex-(& row) gap-8`}>
						<div class={tw`w-64`}>
							<p class={tw`font-medium mb-1`}>Site Metadata</p>
							<p class={tw`text-gray-300 text-sm`}>
								The basic description of your website.
							</p>
						</div>
						<div class={tw`grow pt-1 flex-(& col) gap-4`}>
							<Input for='name' />
							<Input for='address' />
							<Input for='description' class={tw`h-24`} />
						</div>
					</div>

					<div class={tw`flex-(& row) gap-8 pt-4 mt-6 mb-1`}>
						<div class={tw`w-64`}>
							<p class={tw`font-medium mb-1`}>Site Appearance</p>
							<p class={tw`text-(gray-300 sm)`}>
								Settings that determine how browsers display your website.
							</p>
						</div>
						<div class={tw`grow pt-1 flex-(& col) gap-4`}>
							<Input for='favicon' />
							<Input for='themeColor' />
							<Input for='visibility' />
							<Input for='toggle' />
						</div>
					</div>

					<FloatingDescription position='right' />
				</Form>
			</Card.Body>
		</Card>
	);
}
