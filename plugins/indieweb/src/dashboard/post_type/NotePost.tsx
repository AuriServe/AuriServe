import { h } from 'preact';
import { Icon, tw } from 'dashboard';

import { DashboardPostType } from '../PostRegistry';
import UnknownPostEditor from '../UnknownPostEditor';

export const TYPE: DashboardPostType<any> = {
	type: 'note',

	icon: Icon.file,

	editor: UnknownPostEditor,

	preview: (post) => {
		const content = post.data.content as string;
		let openingTag = content.indexOf('<p>') + 3;
		if (openingTag === 2) openingTag = 0;
		let closingTag = content.indexOf('</p>');
		if (closingTag === -1) closingTag = content.length;
		const slice = content.substring(openingTag, closingTag);
		return (
			<p class={tw`text-([13px] gray-200) font-medium leading-4
				text-ellipsis overflow-hidden break-words line-clamp-3 mb-0.5`}
				dangerouslySetInnerHTML={{ __html: slice }}/>
		);
	}
}

export default TYPE;
