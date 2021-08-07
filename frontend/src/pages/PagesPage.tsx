import { h } from 'preact';

import { useData, QUERY_PAGES } from '../Graph';
import { Title, Page, Card, SectionHeader, Button } from '../structure';

export default function PagesPage() {
	const [ { pages } ] = useData(QUERY_PAGES, []);

	return (
		<Page class='flex justify-center'>
			<Title>Pages</Title>
			<Card class='mx-4 w-full h-min'>
				<SectionHeader icon='/admin/asset/icon/document-dark.svg' class='pb-3'
					title='Manage Pages' subtitle='Manage site pages and elements.' />

				{pages &&
					<ul class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
						{pages.sort((a, b) => a.path > b.path ? 1 : -1).map(page => <li>
							<Button class='gap-2 py-3 px-4 justify-between' to={`/pages/${page.path.substr(1)}`}>
								<p class='flex-shrink-0 w-1/2 truncate'>{page.name ?? page.path}</p>
								<p class='truncate font-normal text-gray-400 dark:text-gray-500 text-right'>
									{page.description || 'No description'}</p>
							</Button>
						</li>)}
					</ul>
				}

				{!pages && <h3 className='text-center text-2xl my-20 text-gray-500'>Loading pages...</h3>}
				{pages && Object.keys(pages).length === 0 && <h3 className='text-center text-2xl my-20 text-gray-500'>No pages found.</h3>}

			</Card>
		</Page>
	);
}
