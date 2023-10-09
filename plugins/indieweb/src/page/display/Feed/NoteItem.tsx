import { h } from 'preact';

import PostItem from './PostItem';

import { FeedRenderCtx } from './Feed';
import { Post } from '../../../server/Database';

interface Props {
	post: Post;
	ctx?: FeedRenderCtx;
}

export default function NoteItem({ post, ctx }: Props) {
	return (
		<PostItem class={`note ${post.data.tmp_image ? 'has_image' : ''}`}
			style={{ '--image': `url(${post.data.tmp_image})` }} i={ctx?.i}>
			<a
				class='inner'
				href={`/note/${post.slug}`}
			>
				{post.data.tmp_image && <div class='image'/>}
				<div class='text element-prose' dangerouslySetInnerHTML={{ __html: post.data.content }}/>
				<div class='meta'>
					<div class='interactions'>
						<button class='hearts'>
							<span>52</span>
						</button>
						<button class='replies'>
							<span>3</span>
						</button>
					</div>
					<span class='date'>22 minutes ago</span>
				</div>
			</a>
		</PostItem>
	);
}
