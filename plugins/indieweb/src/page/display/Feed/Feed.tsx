import { FunctionalComponent, h } from 'preact';
import type { Post } from '../../../server/Database';


import BlogItem from './BlogItem';
import NoteItem from './NoteItem';
import ArtItem from './ArtItem';
import VideoItem from './VideoItem';
import UnknownItem from './UnknownItem';
import SocialMediaItem from './SocialMediaItem';

import * as Database from '../../Database.server';
// const Database = (typeof window === 'undefined' ? require('../../../server/Database') : null) as
// 	typeof import('../../../server/Database');

const identifier = 'indieweb:feed';

const POST_RENDERERS = new Map<string, FunctionalComponent<{ post: Post }>>();

export function addPostRenderer(type: string, renderer: FunctionalComponent<{ post: Post }>) {
	POST_RENDERERS.set(type, renderer);
}

addPostRenderer('blog', BlogItem);
addPostRenderer('note', NoteItem);
addPostRenderer('art', ArtItem);
addPostRenderer('video', VideoItem);

function getPosts(): { month: string, posts: Post[] }[] {
	if (!Database) return [];
	const endOfMonth = new Date();
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	return [
		{ month: 'October', posts: Database.getPostsInDateRange(0, +endOfMonth) },
	];
}

interface Props {
	posts?: { month: string, posts: Post[] }[];
}

export function Feed(props: Props) {
	props.posts ??= getPosts();

	return (
		<div class={identifier} data-scrolltop>
			<div class='background'/>
			{props.posts.map(month => (
				<div key={month} class='section'>
					<h2 class='title'><span>{month.month}</span></h2>
					<div class='posts'>
						{month.posts.map((item, i) => {
							const Renderer = POST_RENDERERS.get(item.type);
							if (!Renderer) return <UnknownItem key={i} post={item}/>;
							return <Renderer key={i} post={item}/>;
						})}
					</div>
				</div>
			))}
			<div class='templates'>
				<SocialMediaItem type='discord'/>
				<SocialMediaItem type='twitch'/>
				<SocialMediaItem type='tumblr'/>
				<SocialMediaItem type='youtube'/>
				<SocialMediaItem type='patreon'/>
				<SocialMediaItem type='github'/>
				<SocialMediaItem type='tumblr2'/>
				<SocialMediaItem type='bluesky'/>
				<SocialMediaItem type='youtube2'/>
			</div>
			<script dangerouslySetInnerHTML={{ __html: `
				let s = document.currentScript;

				s.parentElement.querySelectorAll('.indieweb\\\\:post-item.note').forEach(n => {
					let s = Math.max(Math.ceil((n.children[0].clientHeight - 64) / (64 + 24)), 0) + 1;
					n.style.gridRow = \`span \${s} / span \${s}\`;
				});

				let templateInd = 0;
				let templates = s.parentElement.querySelector('.templates');
				let templateLen = templates.children.length;

				s.parentElement.querySelectorAll('.posts').forEach(p => {
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

				s.remove();
			`}}/>
		</div>
	);
}

export default { identifier, component: Feed };
