import { h } from 'preact';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
}

export default function UnknownItem({ post }: Props) {
	return (
		<div class={`item unknown`}>
			<div class='inner'>
				<div class='text element-prose'>
					<h6>Unknown post type '{post.type}'.</h6>
					<pre>{JSON.stringify(post, undefined, 2)}</pre>
				</div>
			</div>
		</div>
	);
}
