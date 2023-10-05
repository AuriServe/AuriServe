import { h } from 'preact';

import PostItem from './PostItem';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
}

import { getOptimizedImage } from 'media';

export default function ArtItem({ post }: Props) {
	return (
		<PostItem class={`video`}
			style={`--image: url(/media/${getOptimizedImage(post.data.thumbnail, 480)?.path})`}>
			<div class='inner'>
				<img class='image_preload' data-palettize={2}
					src={getOptimizedImage(post.data.thumbnail, 'image_inline')!.path}/>
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
				<button class='play'>
					<span>Play</span>
				</button>
			</div>
		</PostItem>
	);
}
