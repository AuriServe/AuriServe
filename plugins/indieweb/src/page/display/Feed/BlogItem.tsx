import { h } from 'preact';

import PostItem from './PostItem';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
	layout?: 'portrait' | 'landscape';
}

import { getOptimizedImage } from 'media';

export default function BlogItem({ post, layout = 'landscape' }: Props) {
	return (
		<PostItem class={`blog ${layout}`} style={{
			'--image': post.data.banner
				? `url(/media/${getOptimizedImage(post.data.banner, 480)!.path})`
				: undefined
		}}>
			<a class='inner' href={`/post?post=${post.id}`}>
				{post.data.banner && <img class='image_preload' data-palettize={2}
					src={getOptimizedImage(post.data.banner, 'image_inline')!.path}/>
				}
				<div class='image'/>
				<div class='content'>
					<div class='title element-prose'><h3>{post.data.title}</h3></div>
					<div class='text element-prose' dangerouslySetInnerHTML={{ __html: post.data.content }}/>
					<div class='tags'>
						{post.tags.sort().map((tag, i) => (
							<div key={i} class='tag'><span>{tag}</span></div>
						))}
					</div>
				</div>
			</a>
		</PostItem>
	);
}
