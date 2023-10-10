import { Fragment, FunctionalComponent, h } from 'preact';
import { Post } from '../../../common/Type';


import BlogItem from './BlogItem';
import NoteItem from './NoteItem';
import ArtItem from './ArtItem';
import VideoItem from './VideoItem';
import UnknownItem from './UnknownItem';
import WebRingItem from './WebRingItem';
import SocialMediaItem from './SocialMediaItem';

import * as Database from '../../Database.server';
import { merge } from 'common';
import { range } from '../../../common/Util';
// const Database = (typeof window === 'undefined' ? require('../../../server/Database') : null) as
// 	typeof import('../../../server/Database');

const identifier = 'indieweb:feed';

export type FeedLayout = 'masonry' | 'cards' | 'list';

export interface FeedRenderCtx {
	i?: number;
	feedLayout: FeedLayout;
}

const POST_RENDERERS = new Map<string, FunctionalComponent<{ post: Post, ctx?: FeedRenderCtx }>>();

export function addPostRenderer(type: string, renderer: FunctionalComponent<{ post: Post, ctx?: FeedRenderCtx }>) {
	POST_RENDERERS.set(type, renderer);
}

addPostRenderer('blog', BlogItem);
addPostRenderer('note', NoteItem);
addPostRenderer('art', ArtItem);
addPostRenderer('video', VideoItem);

function getPosts(filter: 'all' | string): { month: string, posts: Post[] }[] {
	if (!Database) return [];
	const endOfMonth = new Date();
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	return [
		{
			month: 'October',
			posts: Database.getPostsInDateRange(0, +endOfMonth)
				.sort((a, b) => b.created - a.created)
				.filter(p => filter === 'all' || filter === p.type)
		},
	];
}

interface Props {
	layout: FeedLayout;
	filter: 'all' | string;
}

export function Feed(props: Props) {
	props.layout ??= 'masonry';
	props.filter ??= 'all';
	const posts = getPosts(props.filter);
	let i = 0;

	return (
		<div class={merge(identifier, props.layout)} data-scrolltop>
			<div class='background'/>
			{posts.map(month => (
				<div key={month} class='section'>
					<h2 class='title'><span>{month.month}</span></h2>
					<div class='posts'>
						{month.posts.map((item, i) => {
							const Renderer = POST_RENDERERS.get(item.type);
							if (!Renderer) return <UnknownItem key={i} post={item} ctx={{ i, feedLayout: props.layout }}/>;
							return <Renderer key={i} post={item} ctx={{ i, feedLayout: props.layout }}/>;
						})}
						{props.layout === 'cards' &&
							range(month.posts.length % 3 === 1 ? 2 : month.posts.length % 3 === 2 ? 1 : 0).map(i =>
							<div class='filler' key={i} style={{ '--i': month.posts.length + i + 1 }}/>)}
					</div>
				</div>
			))}
			{props.layout === 'masonry' && <Fragment>
				<div class='templates'>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='discord'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='twitch'/>
					<WebRingItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='zythia'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='tumblr'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='youtube'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='patreon'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='github'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='tumblr2'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='bluesky'/>
					<SocialMediaItem ctx={{ i: posts.length + ++i, feedLayout: props.layout }} type='youtube2'/>
				</div>
				<script dangerouslySetInnerHTML={{ __html: `
					let c = document.currentScript.parentElement;
					c.classList.add('js');

					setTimeout(() => {
						c.querySelectorAll('.indieweb\\\\:post-item.note').forEach(n => {
							n.classList.add('sizer');
							let inner = n.children[0];
							let s = Math.max(Math.ceil((inner.clientHeight - 64) / (64 + 24)), 0) + 1;
							n.style.gridRow = \`span \${s} / span \${s}\`;
							let interactions = inner.querySelector('.interactions');
							let heightDiff = () => n.clientHeight - interactions.offsetHeight - interactions.offsetTop;
							const sizes = [ 'sm', 'md', 'lg' ];
							if (heightDiff() > 20) {
								let i = 0;
								while (heightDiff() > 10 && i < sizes.length - 1) {
									inner.classList.remove(...sizes);
									inner.classList.add(sizes[++i]);
								}
								if (heightDiff() < 10 && i > 0) {
									inner.classList.remove(...sizes);
									inner.classList.add(sizes[--i]);
								}
							}
							console.log(n);
							n.classList.remove('sizer');
							n.classList.add('dynamic');
						});

						let templateInd = 0;
						let templates = c.querySelector('.templates');
						let templateLen = templates.children.length;

						c.querySelectorAll('.posts').forEach(p => {
							let b = 0;
							p.querySelectorAll('.indieweb\\\\:post-item').forEach(i => b = Math.max(b, i.offsetTop + i.clientHeight));
							while (true) {
								let elem = templates.children[(templateInd++) % templateLen].cloneNode(true);
								p.appendChild(elem);
								if (elem.offsetTop >= b) {
									elem.remove();
									break;
								}
							}
						});

						c.querySelector('script').remove();
					}, 1);
				`}}/>
			</Fragment>}
		</div>
	);
}

export default { identifier, component: Feed };
