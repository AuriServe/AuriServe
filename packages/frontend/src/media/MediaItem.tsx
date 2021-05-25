import * as Preact from 'preact';
import { useMemo } from 'preact/hooks';

import { Format } from 'common';
import { User, Media } from 'common/graph/type';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';

import './MediaItem.sass';

interface Props {
	user?: User;
	item: Media;
	ind: number;

	onClick: (_: any) => void;
}

export default function MediaItem({ user, item, ind, onClick }: Props) {
	const callbacks = useMemo(() => ({ onDoubleClick: onClick }), []);

	return (
		<li class='MediaItem'>
			<Selectable class='MediaItem-Select' ind={ind} callbacks={callbacks} doubleClickSelects={true}>
				<MediaIcon path={item.url} />
				<div class='MediaItem-Description'>
					<p class='MediaItem-Title'>{item.name}</p>
					<p class='MediaItem-Author'>Uploaded by {user?.username ?? '[Unknown]'} {Format.date(item.created)}.</p>
					<p class='MediaItem-Size'>{(item.size && Format.vector(item.size, 'px') + ' • ')} {Format.bytes(item.bytes)}</p>
				</div>
			</Selectable>
		</li>
	);
}
