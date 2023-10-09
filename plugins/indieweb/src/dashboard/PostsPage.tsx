import { FunctionComponent, h } from 'preact';
import { Post } from '../server/Database';
import { Page, Card, useData, tw } from 'dashboard';

const QUERY_POSTS = `indieweb { posts { id, slug, type, created, modified, data, tags, media } }`;

interface GraphData {
	indieweb: {
		posts: (Omit<Post, 'data'> & { data: string })[]
	}
}

function UnknownPostRenderer({ post }: { post: Post }) {
	return <Card class={tw`dark:bg-gray-750`}>
		<Card.Body class={tw`grid h-full place-items-center`}>
			<p class={tw`font-medium text-gray-300 text-sm`}>Unknown post type '{post.type}'.</p>
		</Card.Body>
	</Card>
}

const CARD_RENDERERS: Record<string, FunctionComponent<{ post: Post }>> = {
	blog: function BlogPostRenderer({ post }) {
		return (
			<Card class={tw`h-full overflow-hidden dark:bg-gray-750`}>
				<Card.Body class={tw`flex flex-col`}>
					<p class={tw`text-xs tracking-widest font-bold text-gray-300 uppercase shrink-0`}>Blog</p>
					<p class={tw`font-medium mb-2 shrink-0`}>{post.data.title}</p>
					<div class={tw`line-clamp-2`} dangerouslySetInnerHTML={{ __html: post.data.content }}/>
				</Card.Body>
			</Card>
		)
	}
}

export default function PostsPage() {
	const [ data ] = useData<GraphData>(QUERY_POSTS, []);
	const posts = (data.indieweb?.posts ?? []).map(post => ({ ...post, data: JSON.parse(post.data) }));
	console.log(posts);

	return (
		<Page class={tw`p-10`}>
			<Card class={tw`max-w-4xl mx-auto w-full`}>
				<Card.Header
					title='Posts'
					subtitle='All of the posts on this website.'
				/>
				<Card.Body>
					<div class={tw`grid-(& cols-3) auto-rows-[8rem] gap-4`}>
						{posts.map((p) => {
							const Renderer = CARD_RENDERERS[p.type] ?? UnknownPostRenderer;
							return <Renderer key={p.id} post={p}/>;
						})}
					</div>
				</Card.Body>
			</Card>
		</Page>
	)
}
