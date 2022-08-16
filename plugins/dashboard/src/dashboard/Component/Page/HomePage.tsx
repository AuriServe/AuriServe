import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from '../Svg';
import Card from '../Card';
// import Tooltip from '../Tooltip';
import TileLayout from '../TileLayout';
import TreeView, { TreeRenderProps, TreeItem } from '../TreeView';

import { tw } from '../../Twind';
import { getShortcuts } from '../../Shortcut';
import { QUERY_INFO, useData } from '../../Graph';

import * as Icon from '../../Icon';

interface TreeData {
	icon: string;
	name: string;
}

function TreeRenderItem(props: TreeRenderProps<TreeData>) {
	return (
		<div class={tw`rounded bg-gray-700 p-2 flex gap-2 ml-[${props.treeLevel * 16}px] mb-2`}>
			<Svg src={props.icon} size={6}/>
			<p>{props.name}</p>
		</div>
	)
}

export default function MainPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [{ info }] = useData(QUERY_INFO, []);

	const [ treeData, setTreeData ] = useState<TreeItem<TreeData>>({
		key: 'home',
		name: 'Home',
		icon: Icon.home,
		children: [{
			key: 'dashboard',
			name: 'Dashboard',
			icon: Icon.options,
		}, {
			key: 'analytics',
			name: 'Analytics',
			icon: Icon.pie_chart,
			children: [{
				key: 'users',
				name: 'Users',
				icon: Icon.users,
			}]
		}, {
			key: 'log out',
			name: 'Log out',
			icon: Icon.logout
		}]
	});


	return (
		<div>
			<div class={tw`text-center flex-(& col-reverse) mb-12 mt-20`}>
				<h2 class={tw`text-(gray-(900 dark:100) 2xl) mt-1`}>{info?.name}</h2>
				<h3
					class={tw`text-(gray-(600 dark:300) xs) font-medium tracking-widest uppercase`}>
					{info?.domain}
				</h3>
			</div>

			<TileLayout>
				<TileLayout.Grid
					class={tw`mx-auto mb-6 mt-3 w-full max-w-5xl`}
					gap={4}
					columns={3}>
					<TileLayout.Tile width={3} height={2}>
						<div class={tw`flex-(& wrap) justify-center gap-4`}>
							{[...getShortcuts().values()]
								.reverse()
								.slice(0, 3)
								.map((s, i) => (
									<Card
										as='button'
										key={i}
										onClick={() => s.action({ location, navigate })}
										class={tw`group ShortcutButton~(flex gap-5 p-0 text-left transition !outline-none
										rounded-md bg-gray-(hocus:(700 dark:750) active:(700 dark:750)) [flex-basis:calc(33%-8px)]
										ring-((accent-500/25 offset-gray-900) focus:(& offset-2) active:(& offset-2)))`}>
										<Svg
											src={s.icon ?? Icon.shortcut}
											size={8}
											class={tw`
											m-(1.5 dark:0) px-(4 dark:5) py-([1.625rem] dark:8) mr-0
											rounded-(& dark:(none l-md)) transition
											bg-gray-((100 dark:750) group-hocus:(200 dark:700) group-active:(100 dark:700))
											icon-p-(group-hocus:white group-active:white)
											icon-s-(group-hocus:accent-300 group-active:accent-300)`}
										/>
										<div class={tw`flex flex-col self-center`}>
											<p
												class={tw`truncate leading-4 font-medium
												text-((gray-800 dark:gray-100) group-hocus:(dark:50) group-active:(dark:50))`}>
												{s.title}
											</p>
											{s.description && (
												<p
													class={tw`truncate leading-4 text-sm pt-2 transition
													text-gray-(600 dark:200) dark:group-hocus:text-accent-200 dark:group-active:text-accent-200`}>
													{s.description}
												</p>
											)}
										</div>
									</Card>
								))}
						</div>
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={4}>
						<Card class={tw`h-full`}>
							<Card.Body>
								<TreeView<TreeData> data={treeData} render={TreeRenderItem}/>
							</Card.Body>
						</Card>
					</TileLayout.Tile>
											{/* <TileLayout.Tile width={2} height={4}> */}
					{/*<Card class={tw`h-full`}>
						<Card.Body
							class={tw`grid-(& rows-[repeat(auto-fit,3rem)] cols-[repeat(auto-fit,3rem)]) gap-1.5`}>
							{Object.entries(Icon).map(([name, icon]) => (
								<div key={name} class={tw`bg-gray-750 rounded w-12 h-12`}>
									<Svg src={icon} size={6} class={tw`p-3`} />
									<Tooltip offset={4} position='bottom' label={name} small />
								</div>
							))}
						</Card.Body>
					</Card>*/}
					{/*</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`}>
							<Tooltip position='right'>Hello</Tooltip>
						</Card>
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`}>
							<Tooltip position='right'>Hello</Tooltip>
						</Card>
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`}>
							<Tooltip position='right'>Hello</Tooltip>
						</Card>
					</TileLayout.Tile> */}
				</TileLayout.Grid>
			</TileLayout>
		</div>
	);
}
