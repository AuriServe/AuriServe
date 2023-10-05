import { h } from 'preact';

import PostItem from './PostItem';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
}

export default function NoteItem({ post }: Props) {
	return (
		<PostItem class={`note ${post.data.tmp_image ? 'has_image' : ''}`}
			style={`--image: url(${post.data.tmp_image})`}>
			<div class='inner'>
				{post.data.tmp_image && <div class='image'/>}
				<div class='meta'>
					<div class='account'>
						<img src='/media/variant/profile_aurailus.128.webp'/>
						<span>Aurailus</span>
					</div>
					<span class='date'>22 minutes ago</span>
				</div>
				<div class='text element-prose' dangerouslySetInnerHTML={{ __html: post.data.content }}/>
				<div class='interactions'>
					<button class='hearts'>
						<span>52</span>
					</button>
					<button class='replies'>
						<span>3</span>
					</button>
				</div>
			</div>
		</PostItem>
	);
}
