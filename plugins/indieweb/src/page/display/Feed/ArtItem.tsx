import { h } from 'preact';
import { getOptimizedImage } from 'media';

import PostItem from './PostItem';
import { FeedRenderCtx } from './Feed';

import { Post } from '../../../common/Type';

interface Props {
	post: Post;
	ctx?: FeedRenderCtx;
}


export default function ArtItem({ post, ctx }: Props) {
	return (
		<PostItem class={`art ${post.data.shape ?? 'portrait'} crop-${post.data.crop ?? 'center'}`} i={ctx?.i}
			style={{ '--image': `url(/media/${getOptimizedImage(post.data.media, 480)?.path})` }}>
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
