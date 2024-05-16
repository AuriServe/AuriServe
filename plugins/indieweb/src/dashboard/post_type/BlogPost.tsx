import { h } from 'preact';
import { Icon, tw } from 'dashboard';

import { BlogPost } from '../../common/Type';
import BlogPostEditor from '../BlogPostEditor';
import { DashboardPostType } from '../PostRegistry';

export const TYPE: DashboardPostType<BlogPost> = {
	type: 'blog',

	icon: Icon.book,

	editor: BlogPostEditor,

	preview: (post) => {
		const revision = post.data.revisions[post.data.currentRevision];
		const title = revision?.title ?? '(Untitled)';
		const content = revision?.preview ?? '';
		let openingTag = content.indexOf('<p>') + 3;
		if (openingTag === 2) openingTag = 0;
		let closingTag = content.indexOf('</p>');
		if (closingTag === -1) closingTag = content.length;
		const slice = content.substring(openingTag, closingTag);
		return (
			<div class={tw`mb-0.5`}>
				<p class={tw`text-(sm gray-100) font-medium text-ellipsis overflow-hidden break-words truncate`}>
					{title}
				</p>
				<p class={tw`text-([13px] gray-200) font-medium text-ellipsis overflow-hidden break-words truncate`}>
					{slice}
				</p>
			</div>
		);
	},
}

export default TYPE;
