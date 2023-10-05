import { usePageContext } from 'pages';
import { ComponentChildren, h } from 'preact';

import BlogItem from './Feed/BlogItem';
import { Post } from '../../server/Database';

const identifier = 'indieweb:post';

import * as Database from '../Database.server';

import { getOptimizedImage } from 'media';

interface Props {
	post?: Post;

	children: ComponentChildren;

	recommendations?: Post[];
}

export function PostView(props: Props) {
	props.recommendations ??= Database.getPostsOfType('blog', 3);
	// props.recommendations = [ props.recommendations[0], props.recommendations[2]];
	const post = Number.parseInt(usePageContext()?.params.id ?? '0', 10);
	props.post ??= Database.getPost(post) ?? undefined;

	const hasBanner = props.post?.data.banner != null;
	const showBanner = hasBanner && (props.post?.data.show_banner ?? true);

	if (!props.post) {
		return <p>No post!</p>
	}

	return (
		<article
			data-scrolltop
			class={`${identifier} ${props.post.data.banner ? 'image' : ''}`}
			style={{
				'--image': hasBanner
					? `url(${showBanner
						? `/media/${getOptimizedImage(props.post.data.banner, 1152)?.path}`
						: getOptimizedImage(props.post.data.banner, 'image_inline')?.path});`
					: '',
				'--background-opacity': showBanner ? 0.7 : 0.4
			}}>
			<div class='background'/>
			<div class='inner'>
				{showBanner && <div class='image'/>}

				<div class='content'>

					<div class='tags'>
						{props.post.tags.map((tag, i) => (
							<div key={i} class='tag'>{tag}</div>
						))}
					</div>
					<h2 class='title'>{props.post.data.title}</h2>
					<p class='date'>Posted two weeks ago.</p>

					<div class='body'>
						{props.children}
					</div>
				</div>

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
							{props.recommendations.map(rec => <BlogItem key={rec.id} post={rec} layout='portrait'/>)}
						</div>
					</div>
				</aside>
			</div>
		</article>
	)
}

export default { identifier, component: PostView }
