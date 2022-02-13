import { h } from 'preact';
import { useState } from 'preact/hooks';

// eslint-disable-next-line
// @ts-ignore
import { tw, PrimaryButton, Svg, Spinner } from 'dashboard';

interface Page {
	path: string;
	name: string;
	icon: string;
}

interface PageItemProps {
	page: Page;
	dragging?: boolean;
}

function PageItem({ page, dragging }: PageItemProps) {
	const isActive = dragging;
	// const path = route.path.replace(new RegExp('^' + parentPath), '');
	// const isActive = location.pathname.replace('/admin/routes/edit', '') === route.path + '/';

	return (
		<div class='w-full'>
			<PrimaryButton
				to={isActive ? '/routes/' : `/routes/edit${page.path}/`}
				exact
				class={tw`group text-gray-600 dark:text-gray-100 p-[0.25rem] mb-1 gap-2 ${
					isActive
						? '!bg-gray-200/25 dark:!bg-gray-700 !border-gray-200 dark:!border-gray-800'
						: '!bg-transparent !border-transparent active:!bg-gray-600/20'
				}`}>
				<Svg
					src={page.icon}
					size={6}
					class={tw`rounded p-0.5 ml-px transition-colors ${
						isActive ? 'bg-gray-600' : 'bg-gray-600/50 group-active:bg-gray-600'
					}`}
				/>

				<p class={tw`leading-none text-[15px] flex-grow`}>
					{page.name}
					<br />
					<span class={tw`text-[11px] text-gray-300`}>
						{page.path === '/index' ? '(root)' : page.path || '(virtual)'}
					</span>
				</p>

				{/* <Svg
					src={icon_menu}
					size={5}
					class={tw`transition opacity-0 group-hover:opacity-50 hover:!opacity-100 !pointer-events-auto ${
						isActive && 'opacity-100'
					}`}
				/> */}
			</PrimaryButton>
		</div>
	);
}

export default function PagesPage() {
	// const [{ pages: rawPages, info }] = useData([QUERY_PAGES, QUERY_INFO], []);

	const [pages, setPages] = useState<Page[]>([{ path: '/', name: 'Home', icon: '' }]);

	// useEffect(
	// 	() =>
	// 		void setPages(
	// 			rawPages
	// 				? [...rawPages]
	// 						.map((page) => void (page.name ||= info?.name) || page)
	// 						.sort((a, b) => (a.path === '/index' ? -1 : a.path.localeCompare(b.path)))
	// 						.map((page) => ({ ...page, key: page.path }))
	// 				: undefined
	// 		),
	// 	[rawPages, info?.name]
	// );

	// const location = useLocation();
	// const page = location.pathname.startsWith('/routes/edit/')
	// 	? location.pathname.substring('/routes/edit'.length)
	// 	: undefined;

	return (
		<div class={tw`-mb-14 h-screen flex`}>
			<div
				class={tw`w-72 p-2.5 h-full bg-gray-800 flex-shrink-0 relative z-10 rounded-r-xl
				shadow-lg shadow-gray-900/75`}>
				{/* <SectionHeader class='p-1' title='Configure Routes' icon='/admin/asset/icon/ext-file-color.svg'/>
				<div class='border-b border-gray-600 mt-1.5 mb-2.5'/> */}
				{!pages && <Spinner size={40} class={tw`mt-16 mx-auto animate-fadein-150`} />}
				{pages && (
					<div class={tw`animate-fadein-150`}>
						{/* <TreeView
							itemHeight={44}
							items={pages}
							setItems={setPages}
							dragClass={tw`rounded shadow-lg interact-none`}
							renderItem={({ data, dragging }) => (
								<PageItem page={data} dragging={dragging} />
							)}
						/> */}
						<div>
							{pages.map((page, i) => (
								<PageItem key={i} page={page} />
							))}
						</div>
						<div class={tw`border-b-2 border-gray-600 mb-1.5 mt-0.5`} />
						<PrimaryButton label='Add Route' />
					</div>
				)}
			</div>
			<div class={tw`p-4`}>
				<h1 class={tw`text-7xl text-accent-300 font-black`}>Henlo there, how are you?</h1>
			</div>
		</div>
	);
}
