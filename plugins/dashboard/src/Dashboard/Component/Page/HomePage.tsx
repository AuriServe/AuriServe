import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from '../Svg';
import Card from '../Card';
import Menu from '../Menu/Menu';
import Tooltip from '../Tooltip';
import TileLayout from '../TileLayout';

import { tw } from '../../Twind';
import { getShortcuts } from '../../Shortcut';
import { QUERY_INFO, useData } from '../../Graph';

import * as Icon from '../../Icon';
// import icon_copy from '@res/icon/copy.svg';
// import icon_cut from '@res/icon/cut.svg';
// import icon_paste from '@res/icon/paste.svg';

// import icon_star from '@res/icon/star.svg';
// import icon_compass from '@res/icon/heart.svg';
// import icon_download from '@res/icon/download.svg';
// import icon_update from '@res/icon/update.svg';

// import icon_save from '@res/icon/save.svg';
// import icon_developer from '@res/icon/developer.svg';
// import icon_logout from '@res/icon/logout.svg';
// import icon_file from '@res/icon/file.svg';
// import icon_tag from '@res/icon/tag.svg';

// import * as Icon from '../../Icon';

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
		<Fragment>
			<div class={tw`text-center flex-(& col-reverse) my-12`}>
				<h2 class={tw`text-(gray-(900 dark:100) 2xl) mt-1`}>{info?.name}</h2>
				<h3
					class={tw`text-(gray-(600 dark:300) xs) font-medium tracking-widest uppercase`}>
					{info?.domain}
				</h3>
			</div>

			<TileLayout>
				<TileLayout.Grid class={tw`mx-auto mb-6 mt-3 max-w-5xl`} gap={4} columns={3}>
					<TileLayout.Tile width={3} height={2}>
						<div class={tw`flex-(& wrap) justify-center gap-4`}>
							{[...getShortcuts().values()]
								.reverse()
								.slice(0, 6)
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
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`}>
							<Tooltip position='right'>Hello</Tooltip>
						</Card>
					</TileLayout.Tile>
					<TileLayout.Tile width={2} height={4}>
						<Card class={tw`h-full`}>
							<Card.Body
								class={tw`grid-(& rows-[repeat(auto-fit,3rem)] cols-[repeat(auto-fit,3rem)]) gap-1.5`}>
								{Object.entries(Icon).map(([name, icon]) => (
									<div key={name} class={tw`bg-gray-750 rounded w-12 h-12`}>
										<Svg src={icon} size={6} class={tw`p-3`} />
										<Tooltip
											offset={4}
											position='bottom'
											label={name}
											class={tw`text-sm py-1 px-2 text-gray-100`}
										/>
									</div>
								))}
							</Card.Body>
						</Card>
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class={tw`h-full`} />
					</TileLayout.Tile>
				</TileLayout.Grid>
			</TileLayout>
			<Menu
				openFrom='topLeft'
				active={menuActive}
				class={tw`fixed top-[${mousePos.y}px] left-[${mousePos.x}px]`}>
				<Menu.Header>
					<Menu.Shortcut icon={Icon.undo} label='Undo' />
					<Menu.Shortcut icon={Icon.redo} label='Redo' />
					<Menu.Header.Spacer width={4} />
					<Menu.Shortcut icon={Icon.trash} label='Delete' />
				</Menu.Header>

				<Menu.Entry icon={Icon.copy} label='Copy'>
					<Menu.Shortcut icon={Icon.cut} label='Cut' />
				</Menu.Entry>

				<Menu.Entry icon={Icon.paste} label='Paste'>
					<Menu.Shortcut icon={Icon.paste_before} label='Paste Before' />
					<Menu.Shortcut icon={Icon.paste_after} label='Paste After' />
				</Menu.Entry>

				<Menu.Divider />

				<Menu.Entry icon={Icon.shortcut} label='Convert to'>
					<Menu.Entry icon={Icon.image} label='Image' />
					<Menu.Entry icon={Icon.image} label='Slideshow' />
					<Menu.Entry icon={Icon.image} label='Gallery' />
					<Menu.Entry icon={Icon.image} label='Album' />
				</Menu.Entry>
			</Menu>
		</Fragment>
	);
}
