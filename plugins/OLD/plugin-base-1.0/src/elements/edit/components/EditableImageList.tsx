import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { Media as IMedia } from 'common/graph/type';
import { Label, Media, SelectGroup, CardHeader, MediaItem, MediaUploadForm } from 'editor/components';

import './EditableImageList.sss';

interface Props {
	items: IMedia[];
	setItems: (items: IMedia[]) => void;
	onClose?: () => void;
}

export default function EditableImageList({ items, setItems, onClose }: Props) {
	// @ts-ignore
	const [ { media } ] = useSiteData('media');
	const [ selected, setSelected ] = useState<number[]>([]);
	const [ uploading, setUploading ] = useState<boolean>(false);

	const handleAddImage = (item: IMedia) => {
		setItems([ ...items, item ]);
	};

	const handleUploadImages = (newMedia: IMedia[]) => {
		setItems([ ...items, ...newMedia ]);
		setUploading(false);
	};

	const handleRemoveImages = () => {
		setItems(items.filter((_, i) => !selected.includes(i)));
		setSelected([]);
	};

	const handleShiftImages = (shiftBy: number) => {
		let newMedia = [...items];
		const ind = selected[0];
		const item = newMedia[ind];
		if (ind + shiftBy < 0 || ind + shiftBy >= newMedia.length) return;
		newMedia.splice(ind, 1);
		newMedia.splice(ind + shiftBy, 0, item);
		setItems(newMedia);
		setSelected([ ind + shiftBy ]);
	};

	return (
		<div class='EditableImageList'>
			{!uploading &&
				<>
					<CardHeader icon='/admin/asset/icon/document-dark.svg' title='Edit Images'
						subtitle={'Add, remove, and reorder images.'} />
					<div class='EditableImageList-EditContainer'>
						<div class='EditableImageList-ActionPane'>
							<div class='EditableImageList-ActionPaneSticky'>
								<Label label='Add Image'>
									<Media value='' setValue={(i: string) =>
										// @ts-ignore
										handleAddImage((media ?? []).filter(m => m.identifier === i)[0])} />
								</Label>

								<button style={{ marginTop: '8px', marginBottom: '0' }}
									class="EditableImageList-ActionButton" onClick={() => setUploading(true)}>
									Or Upload Images
								</button>

								{selected.length > 0 &&
									<>
										<Label label='Actions' />

										<button class="EditableImageList-ActionButton" onClick={handleRemoveImages}>
											Remove {selected.length > 1 ? `(${selected.length})` : ''}
										</button>

										{selected.length === 1 &&
											<>
												<button class="EditableImageList-ActionButton" onClick={() => handleShiftImages(-1)}>
													Move Up
												</button>
												<button class="EditableImageList-ActionButton" onClick={() => handleShiftImages(1)}>
													Move Down
												</button>
											</>
										}
									</>
								}

								<Label label='　'>
									{onClose && <button class="EditableImageList-ActionButton" onClick={onClose}>Done</button>}
								</Label>
							</div>
						</div>

						<div class='EditableImageList-ItemsPane'>
							<Label label='Images' />
							<SelectGroup multi={true} class='EditableImageList-Items' selected={selected} setSelected={setSelected}>
								{items.map((item, ind) => <MediaItem item={item} ind={ind} key={item.id} />)}
							</SelectGroup>
						</div>
					</div>
				</>
			}
			{uploading &&
				<>
					<CardHeader icon='/admin/asset/icon/document-dark.svg' title='Upload Images'
						subtitle={'Upload new images to this list.'} />
					<MediaUploadForm onCancel={() => setUploading(false)} onUpload={handleUploadImages}/>
				</>
			}
		</div>
	);
}
