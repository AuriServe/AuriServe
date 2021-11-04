import { h } from 'preact';
import { mergeClasses } from 'common/util';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'preact/hooks';
import { Page as GraphPage } from 'common/graph/type';

import Control from '../editor/Control';
import TreeView from '../structure/TreeView';
import { useData, QUERY_PAGES, QUERY_INFO } from '../Graph';
import { Title, Page, Button, Spinner } from '../structure';

// type RouteType = 'page' | 'directory' | 'asset' | 'blog' | 'account_guard';
//
// const ICONS: Record<RouteType, string> = {
// 	'page': '/admin/asset/icon/document-dark.svg',
// 	'directory': '/admin/asset/icon/folder-dark.svg',
// 	'asset': '/admin/asset/icon/image-dark.svg',
// 	'blog': '/admin/asset/icon/list-view-dark.svg',
// 	'account_guard': '/admin/asset/icon/role-dark.svg'
// };

interface RouteItemProps {
	route: GraphPage;
	dragging?: boolean;
}

function RouteItem({ route, dragging }: RouteItemProps) {
	const isActive = dragging;
	// const path = route.path.replace(new RegExp('^' + parentPath), '');
	// const isActive = location.pathname.replace('/admin/routes/edit', '') === route.path + '/';

	return (
		<div class='w-full'>
			<Button to={isActive ? '/routes/' : `/routes/edit${route.path}/`} exact
				class={mergeClasses('group text-gray-300 dark:text-gray-800 p-[0.25rem] mb-1 gap-2',
					isActive ? '!bg-gray-700/25 dark:!bg-gray-200 !border-gray-700 dark:!border-gray-100'
						: '!bg-transparent !border-transparent active:!bg-gray-300/20')}>

				<img src='/admin/asset/icon/document-dark.svg' alt='page' width={24} height={24}
					class={mergeClasses('w-7 h-7 rounded interact-none p-0.5 ml-px transition-colors',
						isActive ? 'bg-gray-300' : 'bg-gray-300/50 group-active:bg-gray-300')}/>

				<p class='leading-none text-[15px] flex-grow'>
					{route.name}<br/>
					<span class='text-[11px] text-gray-500'>
						{route.path === '/index' ? '(root)' : route.path || '(virtual)'}</span>
				</p>

				<img src='/admin/asset/icon/menu-dark.svg' alt='Options' width={20} height={20}
					class={mergeClasses('w-6 h-6 p-0.5 transition opacity-0 group-hover:opacity-100',
						'hover:filter hover:brightness-200 hover:saturate-50',
						isActive && 'opacity-100')}/>
			</Button>
		</div>
	);
};

export default function PagesPage() {
	let [ { pages: rawPages, info } ] = useData([ QUERY_PAGES, QUERY_INFO ], []);

	const [ pages, setPages ] = useState<any[] | undefined>([]);

	useEffect(() => void(setPages(rawPages ? [ ...rawPages ]
		.map(page => void(page.name ||= info?.name) || page)
		.sort((a, b) => a.path === '/index' ? -1 : a.path.localeCompare(b.path))
		.map(page => ({ ...page, key: page.path })) : undefined)), [ rawPages?.length ]);

	const location = useLocation();
	const page = location.pathname.startsWith('/routes/edit/') ?
		location.pathname.substr('/routes/edit'.length) : undefined;

	return (
		<Page class='flex bg-white dark:bg-gray-50 !pb-0 min-h-screen'>
			<Title>Pages</Title>
			<div class='w-72 p-2.5 h-full bg-gray-100 flex-shrink-0 relative z-10 border-r border-gray-300'>
				{/* <SectionHeader class='p-1' title='Configure Routes' icon='/admin/asset/icon/ext-file-color.svg'/>
				<div class='border-b border-gray-300 mt-1.5 mb-2.5'/> */}
				{!pages && <Spinner size={40} class='mt-16 mx-auto animate-fadein-150'/>}
				{pages && <div class='animate-fadein-150'>
					<TreeView
						itemHeight={44}
						items={pages}
						setItems={setPages}
						dragClass='rounded shadow-lg interact-none'
						renderItem={({ data, dragging }) => <RouteItem route={data as any as GraphPage} dragging={dragging}/>}
					/>
					<div class='border-b border-gray-300 mb-1.5 mt-0.5'/>
					<Button exact class={mergeClasses('!w-full text-left text-gray-300 dark:text-gray-600 p-[0.25rem]',
						'mb-1 gap-2 !bg-transparent !border-transparent active:!bg-gray-300/20')}>
						<img src='/admin/asset/icon/add-dark.svg' alt='new' width={24} height={24}
							class={mergeClasses('w-7 h-7 rounded interact-none p-0.5 ml-px transition-colors bg-gray-300/50')}/>
						<p class='leading-none font-medium text-sm'>Add Route</p>
					</Button>
				</div>}

			</div>
			{page && <Control path={page}/>}
		</Page>
	);
}
