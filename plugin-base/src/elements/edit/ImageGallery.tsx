import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { Input, Modal } from 'as-editor/components';
import { AdminDefinition, Media } from 'auriserve-api';

import EditableImageList from './components/EditableImageList';

import { server as ImageGallery } from '../ImageGallery';

import './ImageGallery.sss';

interface Props {
	props: {
		gap: number;
		width: number;
		aspect?: number;

		lightbox: boolean;
		protect: boolean;

		count?: number;
		loadMore?: number;

		media: Media[];
	};

	setProps: (object: any) => void;
}

export function EditImageGallery({ props, setProps }: Props) {
	const [ editingItems, setEditingItems ] = useState<boolean>(false);

	return (
		<div class='EditImageGallery'>

			<Input.Label label='Children Gap'>
				<Input.Numeric value={props.gap} setValue={(gap: number) => setProps({ gap })} />
			</Input.Label>
			<Input.Label label='Children Width'>
				<Input.Numeric value={props.width} setValue={(width: number) => setProps({ width })} />
			</Input.Label>
			<Input.Label label='Aspect Ratio'>
				<Input.Numeric value={props.aspect} setValue={(aspect: number) => setProps({ aspect })} />
			</Input.Label>

			<Input.Divider />

			<Input.Label label='Progressively Show Images'>
				<Input.Checkbox alignRight={true} value={props.count}
					setValue={(show: boolean) => setProps({ count: show ? 12 : undefined })} />
			</Input.Label>

			{props.count !== undefined &&
				<Preact.Fragment>
					<Input.Label label='Initial Image Count'>
						<Input.Numeric value={props.count} setValue={(count: number) => setProps({ count })} />
					</Input.Label>

					<Input.Label label="Show 'Load More' Button">
						<Input.Checkbox alignRight={true} value={props.loadMore}
							setValue={(loadMore: boolean) => setProps({ loadMore: loadMore ? 6 : undefined })} />
					</Input.Label>

					{props.loadMore !== undefined &&
						<Input.Label label='Load More Count'>
							<Input.Numeric value={props.loadMore} setValue={(loadMore: number) => setProps({ loadMore })} />
						</Input.Label>
					}
				</Preact.Fragment>
			}

			<Input.Divider />

			<Input.Label label='Open Lightbox on Click'>
				<Input.Checkbox alignRight={true} value={props.lightbox} setValue={(lightbox: boolean) => setProps({ lightbox })} />
			</Input.Label>
			<Input.Label label='Copy Protection'>
				<Input.Checkbox alignRight={true} value={props.protect} setValue={(protect: boolean) => setProps({ protect })} />
			</Input.Label>

			<button class="EditImageGallery-ActionButton" onClick={() => setEditingItems(true)}>Manage Images</button>

			<Modal active={editingItems} defaultAnimation={true} onClose={() => setEditingItems(false)}>
				<EditableImageList items={props.media} setItems={(media) => setProps({ media })} />
			</Modal>
		</div>
	);
}

export const admin: AdminDefinition = {
	...ImageGallery,
	element: ImageGallery.element,
	editing: {
		propertyEditor: EditImageGallery
	}
};
