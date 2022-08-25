import type { Page } from 'pages';

const page: Page = {
	metadata: {},
	content: {
		layout: 'default',
		sections: {
			main: {
				element: 'base:stack',
				children: [{
					element: 'base:section',
					children: [{
						element: 'base:stack',
						props: {
							gap: 16
						},
						children: [{
							element: 'base:text',
							props: {
								content: '<h1>Hi there</h1>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<h2>Another one</h2>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<p><em>And another one</em></p>',
							}
						}]
					}]
				}, {
					element: 'base:section',
					props: {
						class: 'accent callout'
					},
					children: [{
						element: 'base:stack',
						props: {
							gap: 16
						},
						children: [{
							element: 'base:text',
							props: {
								content: '<h1>Hi there</h1>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<h2>Another one</h2>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<p><em>And another one</em></p>',
							}
						}]
					}]
				}, {
					element: 'base:section',
					children: [{
						element: 'base:stack',
						props: {
							gap: 16
						},
						children: [{
							element: 'base:text',
							props: {
								content: '<h1>Hi there</h1>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<h2>Another one</h2>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<p><em>And another one</em></p>',
							}
						}]
					}]
				}, {
					element: 'base:section',
					props: {
						class: 'inverted callout'
					},
					children: [{
						element: 'base:stack',
						props: {
							gap: 16
						},
						children: [{
							element: 'base:text',
							props: {
								content: '<h1>Hi there</h1>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<h2>Another one</h2>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<p><em>And another one</em></p>',
							}
						}]
					}]
				}, {
					element: 'base:section',
					children: [{
						element: 'base:stack',
						props: {
							gap: 16
						},
						children: [{
							element: 'base:text',
							props: {
								content: '<h1>Hi there</h1>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<h2>Another one</h2>',
							}
						},
						{
							element: 'base:text',
							props: {
								content: '<p><em>And another one</em></p>',
							}
						}]
					}]
				}]
			}
		}
	}
};

export default page;
