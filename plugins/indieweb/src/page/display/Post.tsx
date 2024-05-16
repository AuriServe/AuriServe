import { h } from 'preact';
import { usePageContext } from 'pages';
import { getOptimizedImage } from 'media';
import { Elements } from 'elements-base';
const Text = Elements.Text.component;

import BlogItem from './Feed/BlogItem';
import { BlogPost } from '../../common/Type';
import * as Database from '../Database.server';

const identifier = 'indieweb:post';

export function PostView() {
	const recommendations = Database.getPosts(3, 'blog');
	const slug = usePageContext()?.params.slug ?? '';
	const post = Database.getPost(slug) ?? undefined;
	const blogPost = post?.data as BlogPost | undefined;
	const revision = blogPost?.revisions[blogPost.currentRevision];

	const hasBanner = revision?.banner != null;
	const showBanner = hasBanner && (revision?.showBanner ?? true);

	if (!post) {
		return <p>No post!</p>
	}

	return (
		<article
			class={`${identifier} ${revision?.banner ? 'image' : ''}`}
			style={{
				'--image': hasBanner
					? `url(${showBanner
						? `/media/${getOptimizedImage(revision!.banner!, 2200)?.path}`
						: getOptimizedImage(revision!.banner!, 'image_inline')?.path});`
					: '',
				'--background-opacity': showBanner ? 0.55 : 0.4,
				'--background-align': revision?.bannerAlign ? `${revision?.bannerAlign[0]}% ${revision?.bannerAlign[1]}%` : undefined
			}}>
			<script dangerouslySetInnerHTML={{ __html: `
				let a = document.currentScript.parentElement;
				setTimeout(() => a.style.setProperty('--scroll-height', document.body.clientHeight), 0);
				document.currentScript.remove();
			`}}/>
			{/* <div class='background'/> */}
			<div class='inner gradient-scrollbar'>
				{showBanner && <div class='image'/>}

				<div class='post'>
					<main class='content'>
						<div class='tags'>
							{post.tags.map((tag, i) => (
								<div key={i} class='tag'>{tag.replace(/_/g, ' ')}</div>
							))}
						</div>
						<h2 class='title'>{revision?.title}</h2>
						<p class='date'>Posted two weeks ago.</p>
						<Text class='body' content={blogPost?.html}/>
					</main>

					<aside>
						<div class='inner'>
							<nav class='contents'>
								<p class='label'>Table of Contents</p>
								<ol>
									<li><a href='#'>Introduction</a></li>
									<li><a href='#'>The basic idea</a></li>
									<li>
										<a href='#'>Use case 1: Heavy computations</a>
										<ol aria-label='sub headers'>
											<li><a href='#'>An alternative approach</a></li>
										</ol>
									</li>
									<li><a href='#'>Use case 2: Preserved references</a></li>
									<li><a href='#'>The useCallback hook</a></li>
									<li>
										<a href='#'>When to use these hooks</a>
										<ol aria-label='sub headers'>
											<li><a href='#'>Inside generic custom hooks</a></li>
											<li><a href='#'>Inside context providers</a></li>
										</ol>
									</li>
									<li><a href='#'>The Joy of React</a></li>
								</ol>
							</nav>

							<div class='recommendations'>
								<p class='label'>Related Posts</p>
								{recommendations.map(rec => <BlogItem key={rec.id} post={rec} layout='portrait'/>)}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</article>
	)
}

export default { identifier, component: PostView };
