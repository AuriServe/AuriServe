import { h } from 'preact';
import { getOptimizedImage } from 'media';

import PostItem from './PostItem';
import { FeedRenderCtx } from './Feed';

import { Post } from '../../../common/Type';

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

	let sanitizedContent = post.data.content.replace(/<(a|h1|h2|h3|h4|h5|h6|blockquote).*?>(.+?)<\/\1>/gi, '$2');

	return (
		<PostItem class={`blog ${layout}`} i={ctx?.i} style={{
			'--image': post.data.banner
				? `url(/media/${getOptimizedImage(post.data.banner, 480)!.path})`
				: undefined,
			'--background-align': post.data.bannerAlign
				? `${post.data.bannerAlign[0]}% ${post.data.bannerAlign[1]}%`
				: undefined
		}}>
			<a class='inner' href={`/blog/${post.slug}`}>
				{post.data.banner && <img class='image_preload' data-palettize={2}
					src={getOptimizedImage(post.data.banner, 'image_inline')!.path}/>
				}
				<div class='image'/>
				<div class='content'>
					<div class='title element-prose'><h3>{post.data.title}</h3></div>
					<div class='text element-prose' dangerouslySetInnerHTML={{ __html: sanitizedContent }}/>
					<div class='tags'>
						{post.tags.sort().map((tag, i) => (
							<div key={i} class='tag'><span>{tag.replace(/_/g, ' ')}</span></div>
						))}
					</div>
				</div>
			</a>
		</PostItem>
	);
}
