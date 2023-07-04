import { FunctionalComponent, h } from 'preact';
import type { Post } from '../../../server/Database';


import PostItem from './PostItem';
import NoteItem from './NoteItem';
import ArtItem from './ArtItem';
import UnknownItem from './UnknownItem';

const Database = (typeof window === 'undefined' ? require('../../../server/Database') : null) as
	typeof import('../../../server/Database');

const identifier = 'indieweb:feed';

const POST_RENDERERS = new Map<string, FunctionalComponent<{ post: Post }>>();

export function addPostRenderer(type: string, renderer: FunctionalComponent<{ post: Post }>) {
	POST_RENDERERS.set(type, renderer);
}

addPostRenderer('post', PostItem);
addPostRenderer('note', NoteItem);
addPostRenderer('art', ArtItem);

function getPosts(): { month: string, posts: Post[] }[] {
	const now = Math.floor(Date.now() / 1000);
	return [
		{ month: 'July', posts: Database.getPostsInDateRange(now - 100000, now + 100000) },
		{ month: 'June', posts: Database.getPostsInDateRange(now - 100000, now + 100000) },
		{ month: 'May', posts: Database.getPostsInDateRange(now - 100000, now + 100000) }
	];
}

interface Props {
	posts?: { month: string, posts: Post[] }[];
}

export function Feed(props: Props) {
	props.posts ??= getPosts();
	console.log(props.posts);

	return (
		<div class={identifier}>
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
			<script dangerouslySetInnerHTML={{ __html: `
				let s = document.currentScript;

				s.parentElement.querySelectorAll('.note').forEach(n => {
					let s = Math.max(Math.ceil((n.children[0].clientHeight - 64) / (64 + 24)), 0) + 1;
					n.style.gridRow = \`span \${s} / span \${s}\`;
				});

				s.parentElement.querySelectorAll('.posts').forEach(p => {
					let b = 0;
					p.querySelectorAll('.item').forEach(i => b = Math.max(b, i.offsetTop + i.clientHeight));
					while (true) {
						let e = document.createElement('div');
						e.classList.add('spacer');
						p.appendChild(e);
						if (e.offsetTop >= b) {
							e.remove();
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
