import { h } from 'preact';
import { useState } from 'preact/hooks';
import { tw, Svg, Icon } from 'dashboard';

import { PageEditorFrame } from './PageEditor';


interface Page {
	path: string;
	name: string;
	icon: string;
}

interface PageItemProps {
	page: Page;
	dragging?: boolean;
}

function PageItem({ page }: PageItemProps) {
	return (
		<div class={tw`w-full`}>
			<div class={tw`group flex items-center gap-2`}>
				<Svg src={page.icon} size={6} class={tw`p-1 bg-gray-700 rounded`} />

				<div class={tw`grow flex flex-col gap-px pt-[3px]`}>
					<p class={tw`text-sm font-medium leading-none`}>{page.name}</p>
					<p class={tw`text-[11px] font-medium text-gray-300`}>
						{page.path === '/' ? '(root)' : page.path || '(virtual)'}
					</p>
				</div>

				<Svg
					src={Icon.menu}
					size={5}
					class={tw`icon-p-gray-300 p-0.5 pt-1 opacity-0 group-hocus:opacity-100`}
				/>
			</div>
		</div>
	);
}

export default function RoutesPage() {
	// const [{ pages: rawPages, info }] = useData([QUERY_PAGES, QUERY_INFO], []);

	const [pages] = useState<Page[]>([
		{ path: '/', name: 'Home', icon: Icon.home },
		{ path: 'about', name: 'About', icon: Icon.info },
		{ path: 'contact', name: 'Contact', icon: Icon.file },
		{ path: 'blog', name: 'Blog', icon: Icon.file },
		{ path: 'social', name: 'Social Media', icon: Icon.heart },
	]);

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
		<div class={tw`-mb-14 flex`}>
			{/* <div class={tw`w-72 p-2.5 h-full bg-gray-800 flex-shrink-0 z-10 shadow`}>
				{!pages && <Spinner size={40} class={tw`mt-16 mx-auto animate-fadein-150`} />}
				{pages && (
					<div class={tw`animate-fadein-150`}>
						<div class={tw`p-1 flex-(& col) gap-3`}>
							{pages.map((page, i) => (
								<PageItem key={i} page={page} />
							))}
						</div>
					</div>
				)}
			</div> */}
			<div class={tw`w-full grid`}>
				<PageEditorFrame/>
			</div>
		</div>
	);
}
