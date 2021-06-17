import * as Preact from 'preact';
import { Media } from 'auriserve-api';
import { useState } from 'preact/hooks';
import { useSiteData } from 'as-editor/hooks';
import { Input, SelectGroup, CardHeader, MediaItem, MediaUploadForm } from 'as-editor/components';

import './EditableImageList.sss';

interface Props {
	items: Media[];
	setItems: (items: Media[]) => void;
	onClose?: () => void;
}

export default function EditableImageList({ items, setItems, onClose }: Props) {
	const [ { media } ] = useSiteData('media');
	const [ selected, setSelected ] = useState<number[]>([]);
	const [ uploading, setUploading ] = useState<boolean>(false);

	const handleAddImage = (item: Media) => {
		setItems([ ...items, item ]);
	};

	const handleUploadImages = (newMedia: Media[]) => {
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
				<Preact.Fragment>
					<CardHeader icon='/admin/asset/icon/document-dark.svg' title='Edit Images'
						subtitle={'Add, remove, and reorder images.'} />
					<div class='EditableImageList-EditContainer'>
						<div class='EditableImageList-ActionPane'>
							<div class='EditableImageList-ActionPaneSticky'>
								<Input.Label label='Add Image'>
									<Input.Media value='' setValue={(i: string) =>
										handleAddImage((media ?? []).filter(m => m.identifier === i)[0])} />
								</Input.Label>

								<button style={{ marginTop: '8px', marginBottom: '0' }}
									class="EditableImageList-ActionButton" onClick={() => setUploading(true)}>
									Or Upload Images
								</button>

								{selected.length > 0 &&
									<Preact.Fragment>
										<Input.Label label='Actions' />

										<button class="EditableImageList-ActionButton" onClick={handleRemoveImages}>
											Remove {selected.length > 1 ? `(${selected.length})` : ''}
										</button>

										{selected.length === 1 &&
											<Preact.Fragment>
												<button class="EditableImageList-ActionButton" onClick={() => handleShiftImages(-1)}>
													Move Up
												</button>
												<button class="EditableImageList-ActionButton" onClick={() => handleShiftImages(1)}>
													Move Down
												</button>
											</Preact.Fragment>
										}
									</Preact.Fragment>
								}

								<Input.Label label='　'>
									{onClose && <button class="EditableImageList-ActionButton" onClick={onClose}>Done</button>}
								</Input.Label>
							</div>
						</div>

						<div class='EditableImageList-ItemsPane'>
							<Input.Label label='Images' />
							<SelectGroup multi={true} class='EditableImageList-Items' selected={selected} setSelected={setSelected}>
								{items.map((item, ind) => <MediaItem item={item} ind={ind} key={item.identifier} />)}
							</SelectGroup>
						</div>
					</div>
				</Preact.Fragment>
			}
			{uploading &&
				<Preact.Fragment>
					<CardHeader icon='/admin/asset/icon/document-dark.svg' title='Upload Images'
						subtitle={'Upload new images to this list.'} />
					<MediaUploadForm onCancel={() => setUploading(false)} onUpload={handleUploadImages}/>
				</Preact.Fragment>
			}
		</div>
	);
}
