import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from '../Svg';
import Card from '../Card';
import Menu from '../Menu/Menu';
import TileLayout from '../TileLayout';
import { Page, Title } from '../structure';

import { tw } from '../Twind';
import { getShortcuts } from '../Shortcut';
import { QUERY_INFO, useData } from '../Graph';

import icon_copy from '@res/icon/copy.svg';
import icon_cut from '@res/icon/cut.svg';
import icon_paste from '@res/icon/paste.svg';

import icon_star from '@res/icon/star.svg';
import icon_compass from '@res/icon/heart.svg';
import icon_download from '@res/icon/download.svg';
import icon_update from '@res/icon/update.svg';

import icon_save from '@res/icon/save.svg';
import icon_developer from '@res/icon/developer.svg';
import icon_logout from '@res/icon/logout.svg';
import icon_file from '@res/icon/file.svg';
import icon_tag from '@res/icon/tag.svg';

export default function MainPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [{ info }] = useData(QUERY_INFO, []);

	const [menuActive, setMenuActive] = useState<boolean>(false);
	const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	useEffect(() => {
		document.addEventListener('click', (e: any) => {
			setMenuActive((active) => {
				if (active) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
				return active;
			});
		});

		document.addEventListener('mousedown', (e: any) => {
			setMenuActive((active) => {
				if (!active && e.button !== 2) return active;
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				if (!active) setMousePos({ x: e.clientX, y: e.clientY });
				return !active;
			});
		});

		document.addEventListener('contextmenu', (e: any) => {
			e.preventDefault();
		});
	}, []);

	return (
		<Page>
			<Title>Home</Title>

			<div class={tw`text-center flex-(& col-reverse) my-12`}>
				<h2 class={tw`text-(gray-(900 dark:100) 2xl) mt-1`}>{info?.name}</h2>
				<h3
					class={tw`text-(gray-(600 dark:300) xs) font-medium tracking-widest uppercase`}>
					{info?.domain}
				</h3>
			</div>

			<TileLayout>
				<TileLayout.Grid class={tw`mx-auto my-6 max-w-5xl`} gap={4} columns={3}>
					<TileLayout.Tile width={3} height={1}>
						<div class={tw`flex-(& wrap) justify-center gap-4`}>
							{getShortcuts()
								.slice(3, 6)
								.map((s, i) => (
									<Card
										as='button'
										key={i}
										onClick={() => s.action({ location, navigate })}
										class={tw`group ShortcutButton~(flex gap-5 p-0 text-left transition !outline-none
											rounded-md bg-gray-(hocus:(700 dark:750) active:(700 dark:750)) [flex-basis:calc(33%-8px)]
											ring-((accent-500/25 offset-gray-900) focus:(& offset-2) active:(& offset-2)))`}>
										{s.icon && (
											<Svg
												src={s.icon}
												size={8}
												class={tw`
													m-(1.5 dark:0) px-(4 dark:5) py-([1.625rem] dark:8) mr-0
													rounded-(& dark:(none l-md)) transition
													bg-gray-((100 dark:750) group-hocus:(200 dark:700) group-active:(100 dark:700))
													icon-p-(group-hocus:white group-active:white)
													icon-s-(group-hocus:accent-300 group-active:accent-300)`}
											/>
										)}
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
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
					<TileLayout.Tile width={2} height={1}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
					<TileLayout.Tile width={2} height={3}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
				</TileLayout.Grid>
			</TileLayout>
			<Menu
				active={menuActive}
				class={tw`fixed top-[${mousePos.y}px] left-[${mousePos.x}px]`}>
				<Menu.Header>
					<Menu.Shortcut icon={icon_copy} label='Copy' />
					<Menu.Shortcut icon={icon_cut} label='Cut' />
					<Menu.Shortcut icon={icon_paste} label='Paste' />
					<Menu.Header.Spacer />
					<Menu.Shortcut icon={icon_star} label='Bookmark' />
				</Menu.Header>

				<Menu.Entry icon={icon_update} label='History'>
					<Menu.Entry icon={icon_compass} label='Reddit' />
					<Menu.Entry icon={icon_compass} label='Twitter' />
					<Menu.Entry icon={icon_compass} label='MDN' />

					<Menu.Divider />

					<Menu.Entry icon={icon_update} label='More History'>
						<Menu.Entry icon={icon_compass} label='Reddit' />
						<Menu.Entry icon={icon_compass} label='Twitter' />
						<Menu.Entry icon={icon_compass} label='MDN' />
					</Menu.Entry>
				</Menu.Entry>

				<Menu.Entry icon={icon_star} label='Bookmarks'>
					<Menu.Entry label='Youtube' />
				</Menu.Entry>

				<Menu.Entry icon={icon_download} label='Downloads' />

				<Menu.Divider />

				<Menu.Entry icon={icon_save} label='Save Page'>
					<Menu.Shortcut icon={icon_tag} label='Add Tag' />
					<Menu.Shortcut icon={icon_file} label='Save as File' />
				</Menu.Entry>

				<Menu.Entry icon={icon_developer} label='Developer'>
					<Menu.Shortcut icon={icon_logout} label='Log Out' />
				</Menu.Entry>
			</Menu>
		</Page>
	);
}
