import { h } from 'preact';

import PostItem from './PostItem';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
}

import { getOptimizedImage } from 'media';

export default function ArtItem({ post }: Props) {
	return (
		<PostItem class={`art ${post.data.shape ?? 'portrait'} crop-${post.data.crop ?? 'center'}`}
			style={`--image: url(/media/${getOptimizedImage(post.data.media, 480)?.path})`}>
			<div class='inner'>
				<img class='image_preload' data-palettize={2}
					src={getOptimizedImage(post.data.media, 'image_inline')!.path}/>
				<div class='image'/>
				<div class='content'>
					<div class='title element-prose'><h3>{post.data.title}</h3></div>
					<div class='text element-prose' dangerouslySetInnerHTML={{ __html: post.data.content }}/>
					<div class='tags'>
						{post.tags.map((tag, i) => (
							<div key={i} class='tag'><span>{tag}</span></div>
						))}
					</div>
				</div>
			</div>
		</PostItem>
	);
}