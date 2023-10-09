import { h } from 'preact';

import PostItem from './PostItem';
import { FeedRenderCtx } from './Feed';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
	ctx?: FeedRenderCtx;
}

export default function UnknownItem({ post, ctx }: Props) {
	return (
		<PostItem class={`unknown`} i={ctx?.i}>
			<div class='inner'>
				<div class='text element-prose'>
					<h6>Unknown post type '{post.type}'.</h6>
					<pre>{JSON.stringify(post, undefined, 2)}</pre>
				</div>
			</div>
		</PostItem>
	);
}
