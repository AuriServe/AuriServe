import { h } from 'preact';
import { getOptimizedImage } from 'media';

import PostItem from './PostItem';
import { FeedRenderCtx } from './Feed';

import { Post } from '../../../server/Database';

interface Props {
	post: Post;
	layout?: 'portrait' | 'landscape';
	ctx?: FeedRenderCtx;
}


// const MAX_SLUG_LEN = 120;

// function getBlogSlug(title: string) {
// 	title = title.replace(/[^a-z0-9]/gi, ' ');
// 	title = title.replace(/\s+/g, '_');
// 	title = title.replace(/^_+/g, '');
// 	title = title.replace(/_+$/g, '');
// 	if (title.length > MAX_SLUG_LEN) {
// 		title = title.slice(0, 120);
// 		let endIndex = title.lastIndexOf('_');
// 		if (endIndex === -1) endIndex = title.length;
// 		title = title.slice(0, endIndex);
// 	}
// 	title = title.toLowerCase();
// 	return title;
// }

export default function BlogItem({ post, ctx, layout = 'landscape' }: Props) {
	if (ctx?.feedLayout === 'cards') layout = 'portrait';

	return (
		<PostItem class={`blog ${layout}`} i={ctx?.i} style={{
			'--image': post.data.banner
				? `url(/media/${getOptimizedImage(post.data.banner, 480)!.path})`
				: undefined
		}}>
			<a class='inner' href={`/blog/${post.slug}`}>
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
