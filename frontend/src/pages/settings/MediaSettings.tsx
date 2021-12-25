import { h } from 'preact';
import { useState } from 'preact/hooks';

import { Format } from 'common';

import Card from '../../Card';
import { Annotation, Toggle } from '../../input';
import { useData, QUERY_MEDIA, QUERY_QUOTAS } from '../../Graph';

import icon_media from '@res/icon/image.svg';

export default function MediaSettings() {
	const [ { media, quotas } ] = useData([ QUERY_MEDIA, QUERY_QUOTAS ], []);
	const [ generateThumbnails, setGenerateThumbnails ] = useState<boolean>(false);
	const [ useModernFormats, setUseModernFormats ] = useState<boolean>(false);

	return (
		<Card>
			<Card.Header icon={icon_media} title='Media' subtitle='Manage media storage and caching settings.'/>
			<Card.Body>
				<p>This site contains <span class='font-medium'>{(media ?? []).length} </span>
					media items occupying a total of <span class='font-medium'>{Format.bytes(quotas?.storage.used ?? 0)}</span> of storage.</p>

				<p>
					Media represents <span class='font-medium'>
						{Math.round((quotas?.storage.used ?? 0) / (quotas?.storage.allocated ?? 0) * 100)}% </span>
					of the allocated <span class='font-medium'>
						{Format.bytes(quotas?.storage.allocated ?? 0)}</span> of storage space.
				</p>

				<Annotation class='pr-20' title='Generate Intermediaries' description={
					'Generates smaller versions of uploaded images to improve page load times. ' +
					'These images are cached to improve load times, so enabling this option consumes more storage space.'}>
					<Toggle value={generateThumbnails} onValue={setGenerateThumbnails} />
				</Annotation>

				<Annotation class='pr-20' title='Convert to Modern Formats' description={
					'Converts images to modern formats, which generally have better compression and result in quicker page loads. ' +
					'The original image is stored for older browsers, so this option will consume more storage on the server.'}>
					<Toggle value={useModernFormats} onValue={setUseModernFormats} />
				</Annotation>

				{/* <SaveConfirmationModal active={isDirty} onSave={handleSave} onReset={handleReset} />*/}
			</Card.Body>
		</Card>
	);
}
