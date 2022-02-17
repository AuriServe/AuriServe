import { Page } from 'pages';

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
					// {
					// 	element: 'Text',
					// 	props: {
					// 		text: 'Hello World :)',
					// 	},
					// },
					// {
					// 	element: 'Text',
					// 	props: {
					// 		text: 'How are you',
					// 	},
					// },
					// {
					// 	element: 'Text',
					// 	props: {
					// 		text: 'Doing?',
					// 	},
					// },
				],
			},
		},
	},
};

export default page;
