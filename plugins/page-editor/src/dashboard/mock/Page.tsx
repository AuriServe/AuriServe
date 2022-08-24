import type { Page } from 'pages';

const page: Page = {
	metadata: {},
	content: {
		layout: 'default',
		sections: {
			main: {
				element: 'Stack',
				props: {
					gap: 4,
				},
				children: [
					{
						element: 'Text',
						props: {
							text: 'Hello World :)',
						},
					},
					{
						element: 'Text',
						props: {
							text: 'How are you',
						},
					},
					{
						element: 'Text',
						props: {
							text: 'Doing?',
						},
					},
					{
						element: 'Stack',
						props: {
							gap: 4,
							horizontal: true,
						},
						children: [
							{
								element: 'Text',
								props: {
									text: 'Hello',
								},
							},
							{
								element: 'Text',
								props: {
									text: 'How',
								},
							},
							{
								element: 'Text',
								props: {
									text: 'are',
								},
							},
							{
								element: 'Text',
								props: {
									text: 'you',
								},
							},
						],
					},
				],
			},
		},
	},
};

export default page;
