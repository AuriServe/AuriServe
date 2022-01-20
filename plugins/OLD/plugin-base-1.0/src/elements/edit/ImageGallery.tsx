import { h } from 'preact';
import { Media } from 'common/graph/type';
import { AdminDefinition, EditProps } from 'plugin-api';

import { merge } from 'common/util';
import { useActiveState } from 'editor/hooks';
import { useData, QUERY_MEDIA } from 'editor/graph';
import { useState, useRef, useEffect } from 'preact/hooks';
import { ComponentArea, Card, Label, Media as MediaInput } from 'editor/components';


import { ImageView } from '../ImageView';
import { server as ImageGallery, Props } from '../ImageGallery';

import './ImageGallery.sss';

import add_icon from '../../../res/add.svg';
import delete_icon from '../../../res/delete.svg';
import sort_up from '../../../res/sort-up.svg';
import sort_down from '../../../res/sort-down.svg';

interface ImageProps {
	media: Media;

	gap: number;
	aspect?: number;

	handleDelete: () => void;
	handleSort: (offset: number) => void;
}

function GalleryImage(props: ImageProps) {
	return (
		<div
			class='EditImageGallery-GalleryImage'
			style={{
				marginBottom: props.gap + 'px',
				gridRow: props.aspect ? '' : `span ${Math.floor(props.media.size!.y / props.media.size!.x * 30)}`
			}}>
			<ImageView
				media={props.media}
				aspect={props.aspect}
				protect={true}
				lightbox={false}
				style={!props.aspect && { height: '100%' }}
			/>
			<div class='EditImageGallery-GalleryImageToolbar'>
				<button class='EditImageGallery-GalleryImageToolbarButton' onClick={() => props.handleSort(-1)} aria-label='Move Up'>
					<img src={sort_up} alt='' role='presentation'/>
				</button>
				<button class='EditImageGallery-GalleryImageToolbarButton' onClick={() => props.handleSort(1)} aria-label='Move Down'>
					<img src={sort_down} alt='' role='presentation'/>
				</button>
				<div style={{ flexGrow: 1 }}/>
				<button class='EditImageGallery-GalleryImageToolbarButton' onClick={props.handleDelete} aria-label='Delete Item'>
					<img src={delete_icon} alt='' role='presentation'/>
				</button>
			</div>
		</div>
	);
}

export function EditImageGallery({ props, setProps }: EditProps<Props>) {
	const { hovered, active } = useActiveState();
	const [ { media } ] = useData(QUERY_MEDIA, []);

	const ref = useRef<HTMLDivElement>(null);

	const [ adding, setAdding ] = useState<boolean>(false);
	const [ loadCount, setLoadCount ] = useState<number>(props.count ?? props.media.length);

	useEffect(() => {
		if (!active) setAdding(false);
	}, [ active ]);

	const handleAdd = (id: string) => {
		const newMedia = [ ...media.filter((media: Media) => media.id === id), ...props.media ];
		setProps({ ...props, media: newMedia });
		setAdding(false);
	};

	const handleDelete = (index: number) => {
		const newMedia = [ ...props.media ];
		newMedia.splice(index, 1);
		setProps({ ...props, media: newMedia });
	};

	const handleSort = (index: number, offset: number) => {
		if (offset + index < 0 || offset + index > props.media.length - 1) return;
		const newMedia = [ ...props.media ];
		const item = newMedia[index];
		newMedia.splice(index, 1);
		// if (offset > 0) offset--;
		newMedia.splice(index + offset, 0, item);
		setProps({ ...props, media: newMedia });
	};

	return (
		<div class={merge('ImageGallery EditImageGallery', active && 'Active')}
			ref={elem => ref.current = elem?.parentElement as HTMLDivElement}>
			<div class='ImageGallery-Grid'
				style={{
					columnGap: props.gap + 'px',
					gridTemplateColumns: `repeat(auto-fit, minmax(min(${props.width ?? 300}px, 100%), 1fr))`
				}}>
				{props.media.slice(0, loadCount).map((media, i) =>
					<GalleryImage
						key={i}
						media={media}
						gap={props.gap ?? 0}
						aspect={props.aspect}

						handleSort={(offset: number) => handleSort(i, offset)}
						handleDelete={() => handleDelete(i)}
					/>)}
			</div>

			{'window' in global && props.loadMore && loadCount < props.media.length &&
				<button onClick={() => setLoadCount(l => l + props.loadMore!)}
					class='ImageGallery-ShowMore Button'>Show More</button>}

			{(hovered || active) && <ComponentArea for={ref.current} active={active} indicator={true}>
				{active && <button class='EditImageGallery-AddButton' onClick={() => setAdding(!adding)}>
					<img src={add_icon} alt='' role='presentation'/>
					<span>Add Image</span>
				</button>}
				{adding && <Card class='EditImageGallery-AddForm'>
					<Label label='Add Image'>
						<MediaInput value='' onValue={handleAdd} focusOnMount/>
					</Label>
				</Card>}
			</ComponentArea>}
		</div>
	);
}

export const admin: AdminDefinition = {
	...ImageGallery,
	editing: {
		focusRing: false,
		inlineEditor: EditImageGallery
	}
};
