import { h } from 'preact';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from '../Svg';
import Card from '../Card';
import TileLayout from '../TileLayout';
import { Page, Title } from '../structure';

import { tw } from '../twind';
import { getShortcuts } from '../Shortcut';
import { QUERY_INFO, useData } from '../Graph';

export default function MainPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [{ info }] = useData(QUERY_INFO, []);

	return (
		<Page>
			<Title>Home</Title>

			<div class={tw`text-center flex-(& col-reverse) my-12`}>
				<h2 class={tw`text-(gray-100 2xl) mt-1`}>{info?.name}</h2>
				<h3 class={tw`text-(gray-300 xs) font-medium tracking-widest uppercase`}>
					{info?.domain}
				</h3>
			</div>

			<TileLayout>
				<TileLayout.Grid class={tw`mx-auto my-6 max-w-5xl`} gap={4} columns={3}>
					<TileLayout.Tile width={3} height={2}>
						<div class={tw`flex-(& wrap) justify-center gap-4`}>
							{getShortcuts()
								.slice(1, 7)
								.map((s, i) => (
									<Card
										as='button'
										key={i}
										onClick={() => s.action({ location, navigate })}
										class={tw`group ShortcutButton~(flex gap-5 p-0 text-left transition !outline-none
											rounded-md hocus:bg-gray-(700 dark:750) active:bg-gray-(700 dark:750) [flex-basis:calc(33%-8px)]
											ring-(accent-500/25 offset-gray-900) focus:ring-(& offset-2) active:ring(& offset-2))`}>
										{s.icon && (
											<Svg
												src={s.icon}
												class={tw`w-8 rounded-l-md transition px-5 py-8 transition
													dark:bg-gray-(750 group-hocus:700 group-active:700)
													group-hocus:icon-p-accent-50 group-hocus:icon-s-accent-400
													group-active:icon-p-accent-50 group-active:icon-s-accent-400`}
											/>
										)}
										<div class={tw`flex flex-col self-center`}>
											<p
												class={tw`truncate leading-4 font-medium text-accent-(dark:(group-hocus:50 group-active:50))`}>
												{s.title}
											</p>
											{s.description && (
												<p
													class={tw`truncate leading-4 text-sm pt-2 transition
														text-gray-(800 dark:200) dark:group-hocus:text-accent-200 dark:group-active:text-accent-200`}>
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
		</Page>
	);
}
