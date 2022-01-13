import { h } from 'preact';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'preact/hooks';
import { Page as GraphPage } from 'common/graph/type';

import Svg from '../Svg';
import Control from '../editor/Control';
import TreeView from '../structure/TreeView';
import { Title, Page, Button, Spinner } from '../structure';

import { tw } from '../twind';
import { useData, QUERY_PAGES, QUERY_INFO } from '../Graph';

import icon_add from '@res/icon/add.svg';
import icon_menu from '@res/icon/menu.svg';
import icon_document from '@res/icon/file.svg';

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
			<Button
				to={isActive ? '/routes/' : `/routes/edit${route.path}/`}
				exact
				class={tw`group text-gray-600 dark:text-gray-100 p-[0.25rem] mb-1 gap-2 ${
					isActive
						? '!bg-gray-200/25 dark:!bg-gray-700 !border-gray-200 dark:!border-gray-800'
						: '!bg-transparent !border-transparent active:!bg-gray-600/20'
				}`}>
				<Svg
					src={icon_document}
					size={6}
					class={tw`rounded p-0.5 ml-px transition-colors ${
						isActive ? 'bg-gray-600' : 'bg-gray-600/50 group-active:bg-gray-600'
					}`}
				/>

				<p class={tw`leading-none text-[15px] flex-grow`}>
					{route.name}
					<br />
					<span class={tw`text-[11px] text-gray-300`}>
						{route.path === '/index' ? '(root)' : route.path || '(virtual)'}
					</span>
				</p>

				<Svg
					src={icon_menu}
					size={5}
					class={tw`transition opacity-0 group-hover:opacity-50 hover:!opacity-100 !pointer-events-auto ${
						isActive && 'opacity-100'
					}`}
				/>
			</Button>
		</div>
	);
}

export default function PagesPage() {
	const [{ pages: rawPages, info }] = useData([QUERY_PAGES, QUERY_INFO], []);

	const [pages, setPages] = useState<any[] | undefined>([]);

	useEffect(
		() =>
			void setPages(
				rawPages
					? [...rawPages]
							.map((page) => void (page.name ||= info?.name) || page)
							.sort((a, b) => (a.path === '/index' ? -1 : a.path.localeCompare(b.path)))
							.map((page) => ({ ...page, key: page.path }))
					: undefined
			),
		[rawPages, info?.name]
	);

	const location = useLocation();
	const page = location.pathname.startsWith('/routes/edit/')
		? location.pathname.substring('/routes/edit'.length)
		: undefined;

	return (
		<Page class={tw`flex bg-white dark:bg-gray-900 !pb-0 min-h-screen`}>
			<Title>Pages</Title>
			<div
				class={tw`w-72 p-2.5 h-full bg-gray-800 flex-shrink-0 relative z-10 rounded-r-xl
				shadow-lg shadow-gray-900/75 -mr-2.5`}>
				{/* <SectionHeader class='p-1' title='Configure Routes' icon='/admin/asset/icon/ext-file-color.svg'/>
				<div class='border-b border-gray-600 mt-1.5 mb-2.5'/> */}
				{!pages && <Spinner size={40} class={tw`mt-16 mx-auto animate-fadein-150`} />}
				{pages && (
					<div class={tw`animate-fadein-150`}>
						<TreeView
							itemHeight={44}
							items={pages}
							setItems={setPages}
							dragClass={tw`rounded shadow-lg interact-none`}
							renderItem={({ data, dragging }) => (
								<RouteItem route={data as any as GraphPage} dragging={dragging} />
							)}
						/>
						<div class={tw`border-b-2 border-gray-600 mb-1.5 mt-0.5`} />
						<Button
							exact
							class={tw`
								!w-full text-left text-gray-600 dark:text-gray-200 p-[0.25rem]
								mb-1 gap-2 !bg-transparent !border-transparent active:!bg-gray-600/20 !outline-none`}>
							<Svg
								src={icon_add}
								size={6}
								class={tw`rounded p-0.5 ml-px transition-colors bg-gray-600/50 group-active:bg-gray-600`}
							/>
							<p class={tw`leading-none font-medium text-sm`}>Add Route</p>
						</Button>
					</div>
				)}
			</div>
			{page && <Control path={page} />}
		</Page>
	);
}
