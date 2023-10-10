import { VNode, h } from 'preact';
import { titleCase } from 'common';
import { Post, Visibility } from '../common/Type';
import { Page, Card, useData, tw, Icon, Table, Svg, Tooltip, useNavigate } from 'dashboard';

const QUERY_POSTS = `indieweb { posts { id, slug, type, created, modified, visibility, data, tags, media } }`;

interface GraphData {
	indieweb: {
		posts: (Omit<Post, 'data'> & { data: string })[]
	}
}

interface PostTypeMeta {
	icon: string;
	label?: string;
	content: (post: Post) => VNode;
}

const VISIBILITY_ICONS: Record<Visibility, string> = {
	[Visibility.Private]: Icon.star,
	[Visibility.Unlisted]: Icon.heart,
	[Visibility.Public]: Icon.globe
}

const POST_TYPE_META: Record<string, PostTypeMeta> = {
	blog: {
		icon: Icon.book,
		content: (post) => {
			const title = post.data.title as string;
			const content = post.data.content as string;
			let openingTag = content.indexOf('<p>') + 3;
			if (openingTag === 2) openingTag = 0;
			let closingTag = content.indexOf('</p>');
			if (closingTag === -1) closingTag = content.length;
			const slice = content.substring(openingTag, closingTag);
			return <p class={tw`text-sm p-2 pr-8 pt-2.5
				mt-px text-ellipsis overflow-hidden break-words truncate`}>
				<span class={tw`text-gray-100 font-medium`}>{title}</span>
				<span class={tw`text-gray-200`}>{' '}- {slice}</span>
			</p>
		}
	},
	note: {
		icon: Icon.file,
		content: (post) => {
			const content = post.data.content as string;
			let openingTag = content.indexOf('<p>') + 3;
			if (openingTag === 2) openingTag = 0;
			let closingTag = content.indexOf('</p>');
			if (closingTag === -1) closingTag = content.length;
			const slice = content.substring(openingTag, closingTag);
			return <p class={tw`text-(sm gray-200) p-2 pr-8 pt-2.5
				mt-px text-ellipsis overflow-hidden break-words truncate`}
				dangerouslySetInnerHTML={{ __html: slice }}/>;
		}
	},
	video: {
		icon: Icon.plugin,
		content: (post) => {
			const title = post.data.title as string;
			const content = post.data.content as string;
			let openingTag = content.indexOf('<p>') + 3;
			if (openingTag === 2) openingTag = 0;
			let closingTag = content.indexOf('</p>');
			if (closingTag === -1) closingTag = content.length;
			const slice = content.substring(openingTag, closingTag);
			return <p class={tw`text-sm p-2 pr-8 pt-2.5
				mt-px text-ellipsis overflow-hidden break-words truncate`}>
				<span class={tw`text-gray-100 font-medium`}>{title}</span>
				<span class={tw`text-gray-200`}>{' '}- {slice}</span>
			</p>
		}
	},
	art: {
		icon: Icon.image,
		content: (post) => {
			const content = post.data.title as string;
			return <p class={tw`text-(sm gray-100) font-medium p-2 pt-2.5
				mt-px text-ellipsis overflow-hidden break-words truncate`}>
				{content}
			</p>
		}
	},
	UNKNOWN: {
		icon: Icon.close_circle,
		content: (post) => {
			return <p class={tw`text-(sm gray-200) font-medium italic p-2 pt-2.5
				mt-px text-ellipsis overflow-hidden break-words truncate`}>
				Post type '{post.type}' is unknown.
			</p>
		}
	}
}

export default function PostListPage() {
	const navigate = useNavigate();
	const [ data ] = useData<GraphData>(QUERY_POSTS, []);
	const posts = (data.indieweb?.posts ?? []).map(post => ({ ...post, data: JSON.parse(post.data) }));

	function handleDoubleClick(post: Post) {
		navigate(`/posts/${post.slug}`);
	}

	return (
		<Page class={tw`p-10`}>
			<Card class={tw`max-w-5xl mx-auto w-full`}>
				<Card.Header
					title='Posts'
					subtitle='All of the posts on this website.'
					icon={Icon.receipt}
				/>
				<Card.Body class={tw`p-0 -mt-2`}>
					<Table<Post>
						columns={[
							{ name: 'type', size: '90px', sortable: true },
							{ name: 'id', size: '40px', visible: false, sortable: true, sortReversed: true },
							{ name: 'slug', size: '164px', sortable: true },
							{ name: 'content', size: '2fr' },
							{ name: 'tags', size: '1fr', visible: false },
							{ name: 'created', size: '96px', sortable: true, sortReversed: true },
							{ name: 'modified', size: '96px', visible: false, sortable: true, sortReversed: true },
							{ name: 'visibility', sortable: true, size: '88px' }
						]}
						data={posts}
						sortBy='created'
						sortReversed={true}
						itemsPerPage={100000}
						headerClass={tw`bg-gray-750 px-3 py-1 sticky top-0 z-30 shadow-lg shadow-gray-800`}
						rowClass={tw`even:(bg-gray-700/25) px-3`}
						footerClass={tw`hidden`}
					>
						{(post, ctx) => {
							return (
								<div
									class={tw`grid py-1.5`}
									style={{ gridTemplateColumns: ctx.columns.filter(c => c.visible ?? true)
										.map(c => c.size ?? '1fr').join(' ') }}
									onDblClick={() => handleDoubleClick(post)}
								>
									{ctx.columns.filter(c => c.visible ?? true).map(col => {
										switch (col.name) {
											default:
												return <p class={tw`p-2`}>{col.name}</p>
											case 'type': {
												const meta = POST_TYPE_META[post.type] ?? POST_TYPE_META.UNKNOWN;
												return <div class={tw`flex gap-2 p-2 pl-1`}>
													<Svg src={meta.icon} size={5} class={tw`shrink-0 icon-p-gray-100 mt-0.5 icon-s-gray-300`}/>
													<p class={tw`font-bold text-gray-200 text-sm pt-1 -mt-px`}>{meta.label ?? titleCase(post.type)}</p>
												</div>;
											}
											case 'id': {
												return <p class={tw`p-2 pt-4 -mt-px select-all font-(mono bold) text-(xs gray-300)`}>
													<span>
														{post.id}
													</span>
												</p>;
											}
											case 'slug': {
												return <p class={tw`p-2 pt-4 -mt-px break-words text-ellipsis relative
													truncate select-all overflow-hidden font-(mono bold) text-(xs gray-300)`}>
													<span>
														{post.slug}
														<Tooltip position='bottom' label={post.slug} small class={tw`font-mono`}/>
													</span>
												</p>;
											}
											case 'content': {
												const meta = POST_TYPE_META[post.type] ?? POST_TYPE_META.UNKNOWN;
												return meta.content(post);
											}
											case 'visibility': {
												return <div class={tw`flex justify-end gap-2 p-2 pr-1`}>
													<p class={tw`font-bold text-sm text-gray-200 pt-1 -mt-px`}>{Visibility[post.visibility]}</p>
													<Svg src={VISIBILITY_ICONS[post.visibility]}
														size={5} class={tw`shrink-0 icon-p-gray-200 mt-0.5 icon-s-gray-400`}/>
												</div>;
											}
											case 'created':
											case 'modified': {
												return <p class={tw`p-2 pt-4 -mt-0.5 break-words text-ellipsis relative
													truncate overflow-hidden font-bold text-(xs gray-300)`}>
													<span>
														{new Date(post[col.name] * 1000).toLocaleDateString('en-US',
															{ month: 'short', day: '2-digit', year: 'numeric' })}
														<Tooltip position='bottom' label={new Date(post[col.name] * 1000)
															.toLocaleTimeString('en-us', { minute: 'numeric', hour: 'numeric' })}
															small class={tw`font-mono`}/>
													</span>
												</p>;
											}
										}
									})}
								</div>
							)
						}}
					</Table>
				</Card.Body>
			</Card>
		</Page>
	)
}
