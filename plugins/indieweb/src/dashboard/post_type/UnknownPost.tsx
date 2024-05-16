import { h } from 'preact';
import { Icon, tw } from 'dashboard';

import { BlogPost } from '../../common/Type';
import { DashboardPostType } from '../PostRegistry';
import UnknownPostEditor from '../UnknownPostEditor';

export const TYPE: DashboardPostType<BlogPost> = {
	type: 'UNKNOWN',

	icon: Icon.close_circle,

	editor: UnknownPostEditor,

	preview: (post) => {
		return (
			<p class={tw`text-(sm gray-200) font-medium italic
				text-ellipsis overflow-hidden break-words truncate`}>
				Post type '{post.type}' is unknown.
			</p>
		);
	},
}

export default TYPE;
