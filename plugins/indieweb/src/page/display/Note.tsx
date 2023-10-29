import { h } from 'preact';
import { usePageContext } from 'pages';
import { Elements } from 'elements-base';
const Text = Elements?.Text?.component;

import * as Database from '../Database.server';
import NoteItem from './Feed/NoteItem';

const identifier = 'indieweb:note';

export function NoteView() {
	const allPosts = Database.getPosts(1000, 'note');
	const slug = usePageContext()?.params.slug ?? '';
	const post = Database.getPost(slug) ?? undefined;
	console.log(slug);

	if (!post) {
		return <p>No post!</p>
	}

	post.tags = [ 'auri', 'stuff', 'owo', 'zepha', 'youtube' ];

	const comments: { user: string, picture: string, content: string, posted: string }[] = [
		{
			user: 'Auri',
			picture: 'https://avatars.githubusercontent.com/u/18364',
			content: '<p>I have a Calculus exam coming up tomorrow. Oooh boy, my anxiety is spiking. I have a Calculus exam coming up tomorrow. Oooh boy, my anxiety is spiking.</p>',
			posted: '2 days ago'
		},
		{
			user: 'Auri',
			picture: 'https://avatars.githubusercontent.com/u/18364747',
			content: '<p>This is a comment.</p>',
			posted: '2 days ago'
		}
	]

	return (
		<div
			data-scrolltop
			class={`${identifier} ${post.data.banner ? 'image' : ''}`}
		>
			<div class='background'/>

			<aside>
				<div class='inner'>
					<div class='scroll'>
						{allPosts.map((note, i) => <NoteItem post={note} ctx={{ i, feedLayout: 'list' }} key={note.slug}/>)}
					</div>
					{/* <nav class='contents'>
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
					</div> */}
				</div>
			</aside>

			<main>
				<article class='post'>
					<p class='label'>Post</p>
					<img src='http://localhost:8080/media/variant/image_aurailus.128.webp' alt=''/>
					<div class='tags'>
						{post.tags.map((tag, i) => (
							<div key={i} class='tag'>{tag}</div>
						))}
					</div>
					<p class='date'>Posted two weeks ago.</p>
					<Text class='body' content={post.data.content}/>
				</article>
				<div class='comments'>
					<p class='label'>Comments</p>
					{comments.map((comment, i) => (
						<div class='comment' key={i}>
							<img src={comment.picture} alt=''/>
							<p class='meta'>
								<span class='name'>{comment.user}</span>
								<span class='date'>{comment.posted}</span>
							</p>
							<Text content={comment.content}/>
						</div>
					))}
				</div>
			</main>
		</div>
	)
}

export default { identifier, component: NoteView };
