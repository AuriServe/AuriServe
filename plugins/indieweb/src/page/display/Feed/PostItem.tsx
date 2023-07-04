import { h } from 'preact';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
}

export default function PostItem({ post }: Props) {
	return (
		<div class='item post' style={`--image: url(${post.data.tmp_image})`}>
			<div class='inner'>
				<div class='image'/>
				<div class='content'>
					<div class='title element-prose'><h3>{post.data.title}</h3></div>
					<div class='text element-prose' dangerouslySetInnerHTML={{ __html: post.data.content }}/>
					<div class='tags'>
						{post.tags.map((tag, i) => (
							<div key={i} class='tag'>{tag}</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
