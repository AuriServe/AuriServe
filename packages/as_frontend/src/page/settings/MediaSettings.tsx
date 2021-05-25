import * as Preact from 'preact';
import { useState } from 'preact/hooks';

import { Format } from 'as_common';

import { Label, Annotation, Checkbox } from '../../input/Input';
import { useQuery, QUERY_ALL_MEDIA, QUERY_QUOTAS } from '../../Graph';

import './MediaSettings.sass';

export default function MediaSettings() {
	const [ { media, quotas } ] = useQuery([ QUERY_ALL_MEDIA, QUERY_QUOTAS ]);
	const [ generateThumbnails, setGenerateThumbnails ] = useState<boolean>(false);
	const [ useModernFormats, setUseModernFormats ] = useState<boolean>(false);

	// const handleReset = () => console.log('reset');
	// const handleSave = () => console.log('save');

	// const isDirty = generateThumbnails || useModernFormats;

	return (
		<div class='Settings MediaSettings'>
			<Label label='Media Statistics' />

			<p>This site contains <strong>{(media ?? []).length} </strong>
				media items occupying a total of <strong>{Format.bytes(quotas?.storage.used ?? 0)}</strong> of storage.</p>

			<p>Media represents <strong>{Math.round((quotas?.storage.used ?? 0) / (quotas?.storage.allocated ?? 0) * 100)}% </strong>
				of the allocated <strong>{Format.bytes(quotas?.storage.allocated ?? 0)}</strong> of storage space.</p>

			<Label label='Media Image Options' />

			<Annotation title='Generate Intermediaries' description={
				'Generates smaller versions of uploaded images to improve page load times. ' +
				'These images are cached to improve load times, so enabling this option consumes more storage space.'}>
				<Checkbox value={generateThumbnails} setValue={setGenerateThumbnails} />
			</Annotation>

			<Annotation title='Convert to Modern Formats' description={
				'Converts images to modern formats, which generally have better compression and result in quicker page loads. ' +
				'The original image is stored for older browsers, so this option will consume more storage on the server.'}>
				<Checkbox value={useModernFormats} setValue={setUseModernFormats} />
			</Annotation>

			{/* <SaveConfirmationModal active={isDirty} onSave={handleSave} onReset={handleReset} />*/}
		</div>
	);
}
