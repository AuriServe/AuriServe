import { h } from 'preact';
import { useAsyncEffect, useStore } from 'vibin-hooks';
import { useEffect, useMemo, useRef } from 'preact/hooks';

import { getThumbnail } from './Util';
import { MediaGraph } from '../common/Type';
import { QUERY_GET_ALL_MEDIA_OF_TYPE } from './Graph';
import { Modal, Card, executeQuery, tw, Svg, Icon, Button, Form, Field } from 'dashboard';

interface Props {
	active: boolean;
	current: number | null;
	onClose: () => void;
}

export default function MediaImageChooser(props: Props) {
	const media = useStore<MediaGraph[]>([]);
	const sortedMedia = useMemo(() => [ ...media() ].sort((a, b) => a.name.localeCompare(b.name)), [ media() ]);

	const filter = useStore<string>('');
	const currentMedia = (props.current ?? -1) >= 0 ? sortedMedia.find(m => m.id === props.current) : null;

	const filteredMedia = useMemo(() => {
		if (filter() === '') return sortedMedia;
		return sortedMedia.filter(m => m.name.toLowerCase().includes(filter().toLowerCase()));
	}, [ sortedMedia, filter ]);

	useAsyncEffect(async (abort) => {
		if (!props.active) return;
		const items = (await executeQuery(QUERY_GET_ALL_MEDIA_OF_TYPE, { type: 'image' })).media.media;
		if (abort.aborted) return;
		media(items);
	}, [ props.active ]);

	console.log(currentMedia);

	return (
		<Modal active={props.active} onClose={props.onClose}
			class={tw`w-full max-w-7xl grid-(& cols-[auto_32rem]) overflow-hidden`}>
			{/* <Button.Ghost icon={Icon.close} label='Close' iconOnly size={8} class={tw`absolute top-2 right-2`}/> */}
			<div class={tw`col-start-1 p-6 relative bg-gray-900/50`}>
				<input class={tw`rounded-md bg-gray-(input hocus:700) transition p-3 pt-3.5 pl-12
					text-white font-medium w-full outline-none !text-gray-100 shadow-(md black/10)`}
					placeholder='Search...' autoFocus spellCheck={false} onChange={(evt: any) => filter(evt.target.value)}/>
				<Svg src={Icon.search} size={6} class={tw`absolute left-9 ml-0.5 top-8 mt-1
					text-gray-300 icon-(p-gray-200 s-gray-400)`}/>
			</div>
			<div class={tw`grid relative bg-gray-900/50`}>
				{/* <div ref={shadowRef} style={{ opacity: 0 }} class={tw`absolute top-0 left-0 right-4 h-6 bg-gradient-to-b
					from-gray-800 via-gray-800/60 to-transparent interact-none transition duration-100`}/> */}
				{/* <div class={tw`absolute bottom-0 left-0 right-4 h-6 bg-gradient-to-t
					from-gray-900 via-gray-900/60 to-transparent interact-none`}/> */}
				<div
					class={tw`col-start-1 p-6 pt-0 pr-2.5 overflow-auto h-full max-h-[80vh] grid-(& cols-3) gap-(x-6 y-4)
						scroll-(gutter-transparent bar-(transparent hover:gray-600))`}>
					{filteredMedia.map(m => <div class={tw`flex flex-col gap-2`}>
						<div class={tw`bg-(cover center) aspect-[16/10] rounded-md
							bg-gray-700 overflow-hidden shadow-(md black/10)`}
							style={{ backgroundImage: `url(/media/${getThumbnail(m).path})` }}/>
						<p class={tw`text-(sm gray-200) font-medium`}>{m.name}</p>
					</div>)}
				</div>
			</div>
			<div class={tw`col-start-2 row-start-1 row-span-2 p-6 px-8`}>
				<div class={tw`h-18 mb-px`}>
					<p class={tw`text-(xs gray-400) font-bold tracking-widest pt-4 mt-px`}>PREVIEW</p>
					<p class={tw`text-gray-200 font-medium`}>{currentMedia?.name}</p>
				</div>
				<Form initialValue={{ alt: 'The quick brown fox jumps over the lazy dog.' }} description='left'
					class={tw`flex-(& col) gap-6`}>
					<div class={tw`bg-gray-800 rounded-md shadow-(md black/[5%]) overflow-hidden aspect-[16/10] bg-(cover center)`}
						style={{ backgroundImage: currentMedia ? `url(/media/${getThumbnail(currentMedia!, 512).path})` : null }}>
					</div>
					<Field.Text multiline minRows={3.5} path='alt' label='Description'
						description='The description for this image. Screen readers and search engines use this to better understand your site. If left blank, the image will be processed.'/>
				</Form>
			</div>
		</Modal>
	)
}
