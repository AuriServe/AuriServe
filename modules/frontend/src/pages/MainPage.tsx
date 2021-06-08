import * as Preact from 'preact';

import { useQuery, QUERY_INFO } from '../Graph';
import { Title, Page, Card, Button, Meter, SectionHeader } from '../structure';

export default function MainPage() {
	const [ { info } ] = useQuery([ QUERY_INFO ]);

	return (
		<Page>
			<Title>Home</Title>
			<div class='flex flex-col text-center bg-white dark:bg-gray-100
				border-b border-gray-800 dark:border-gray-300 bg-gray-800 py-32'>
				<h1 class='text-3xl my-2'>
					<img class='w-8 h-8 inline mr-2 mb-0.5 align-bottom filter dark:brightness-200 dark:saturate-50'
						src='/admin/asset/icon/globe-dark.svg' width={32} height={32} alt='' role='presentation'/>
					{info?.domain ?? '...'}
				</h1>
				<h2 class='text-xl text-gray-200 my-1'>{info?.name ?? '...'}</h2>
			</div>
			<div class='grid grid-cols-3 gap-4 px-4 mx-auto w-full max-w-screen-xl'>
				<Card class='w-full'>
					<SectionHeader icon='/admin/asset/icon/document-dark.svg' title='Wanna pages?'/>
					<Meter value={33} max={100} />
					<Button class='mt-4' to='/pages' label='Pages'/>
				</Card>
				<Card class='w-full'>
					<SectionHeader icon='/admin/asset/icon/image-dark.svg' title='OwO mediaa'/>
					<Button class='mt-12' to='/media' label='Media'/>
				</Card>
				<Card class='w-full'>
					<SectionHeader icon='/admin/asset/icon/settings-dark.svg' title='(opwinons)'/>
					<Button class='mt-12' to='/settings' label='Settings'/>
				</Card>
			</div>
		</Page>
	);
}
