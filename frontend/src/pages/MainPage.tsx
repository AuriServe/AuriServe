import { h } from 'preact';
import { useHistory } from 'react-router-dom';

import Svg from '../Svg';
import Card from '../Card';
import TileLayout from '../TileLayout';
import { Page, Title } from '../structure';

import { getShortcuts } from '../Shortcut';
import { QUERY_INFO, useData } from '../Graph';

export default function MainPage() {
	const history = useHistory();
	const [{ info }] = useData(QUERY_INFO, []);

	return (
		<Page>
			<Title>Home</Title>

			<div class='text-center flex flex-col-reverse my-12'>
				<h2 class='text-neutral-100 text-2xl mt-1'>{info?.name}</h2>
				<h3 class='text-neutral-300 font-medium text-xs tracking-widest uppercase'>{info?.domain}</h3>
			</div>

			<TileLayout>
				<TileLayout.Grid class='mx-auto my-6 max-w-5xl' gap={4} columns={3}>
					<TileLayout.Tile width={3} height={2}>
						<div class='flex flex-wrap justify-center gap-4'>
							{getShortcuts()
								.slice(1, 7)
								.map((s, i) => (
									<Card
										as='button'
										key={i}
										onClick={() => s.action({ history })}
										class='flex group [flex-basis:calc(33%-8px)] text-left gap-5 p-0 transition !outline-none
									rounded-md hocus:bg-neutral-700 dark:hocus:bg-neutral-750
									ring-accent-500/25 ring-offset-neutral-900
									focus:ring focus:ring-offset-2 active:ring active:ring-offset-2'>
										{s.icon && (
											<Svg
												src={s.icon}
												class='w-8 rounded-l-md transition px-5 py-8 transition
										dark:bg-neutral-750 dark:group-hocus:bg-neutral-700
										group-hocus:icon-p-accent-50 group-hocus:icon-s-accent-400'
											/>
										)}
										<div class='flex flex-col self-center'>
											<p class='truncate leading-4 font-medium dark:group-hocus:text-accent-50'>{s.title}</p>
											{s.description && (
												<p
													class='truncate leading-4 text-sm pt-2 transition
											dark:text-neutral-200 dark:group-hocus:text-accent-200'>
													{s.description}
												</p>
											)}
										</div>
									</Card>
								))}
						</div>
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class='h-full' />
					</TileLayout.Tile>
					<TileLayout.Tile width={2} height={1}>
						<Card class='h-full' />
					</TileLayout.Tile>
					<TileLayout.Tile width={2} height={3}>
						<Card class='h-full' />
					</TileLayout.Tile>
					<TileLayout.Tile width={1} height={2}>
						<Card class='h-full' />
					</TileLayout.Tile>
				</TileLayout.Grid>
			</TileLayout>
		</Page>
	);
}
