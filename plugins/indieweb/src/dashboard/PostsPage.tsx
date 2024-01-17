import { useContext, useEffect, useMemo, useRef } from 'preact/hooks';
import { titleCase } from 'common';
import { Fragment, FunctionalComponent, VNode, h } from 'preact';
import { useAsyncEffect, useAsyncMemo, useStore } from 'vibin-hooks';
import { Button, EventEmitter, Icon, Svg, Tooltip, executeQuery, tw, useData, useNavigate } from 'dashboard';

import BlogPostEditor from './BlogPostEditor';
import UnknownPostEditor from './UnknownPostEditor';

import { BlogPost, Post, Visibility } from '../common/Type';
import { PostEditorContext, PostEditorContextData, SaveReason, SaveState } from './PostEditorContext';

const QUERY_POSTS = `indieweb { posts { id, slug, type, created, modified, visibility, data, tags, media } }`;
const QUERY_POST = `query($slug: String!) {
	indieweb { postBySlug(slug: $slug) { id, slug, type, created, modified, visibility, data, tags, media } } }`;

interface GraphData {
	indieweb: {
		posts: (Omit<Post, 'data'> & { data: string })[]
	}
}

interface PostTypeMeta {
	icon: string;
	label?: string;
	editor: FunctionalComponent<{}>,
	create?: () => void;
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
			const blogData = post.data as BlogPost;
			const revision = blogData.revisions[blogData.currentRevision];
			const title = revision?.title ?? '(Untitled)';
			const content = revision?.preview ?? '';
			let openingTag = content.indexOf('<p>') + 3;
			if (openingTag === 2) openingTag = 0;
			let closingTag = content.indexOf('</p>');
			if (closingTag === -1) closingTag = content.length;
			const slice = content.substring(openingTag, closingTag);
			return (
				<div class={tw`mb-0.5`}>
					<p class={tw`text-(sm gray-100) font-medium text-ellipsis overflow-hidden break-words truncate`}>
						{title}
					</p>
					<p class={tw`text-([13px] gray-200) font-medium text-ellipsis overflow-hidden break-words truncate`}>
						{slice}
					</p>
				</div>
			);
		},
		editor: BlogPostEditor,
		create: () => {}
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
			return <p class={tw`text-([13px] gray-200) font-medium leading-4
				text-ellipsis overflow-hidden break-words line-clamp-3 mb-0.5`}
				dangerouslySetInnerHTML={{ __html: slice }}/>;
		},
		editor: UnknownPostEditor,
		create: () => {}
	},
	video: {
		icon: Icon.film,
		content: (post) => {
			const title = post.data.title as string;
			const content = post.data.content as string;
			let openingTag = content.indexOf('<p>') + 3;
			if (openingTag === 2) openingTag = 0;
			let closingTag = content.indexOf('</p>');
			if (closingTag === -1) closingTag = content.length;
			const slice = content.substring(openingTag, closingTag);
			return <p class={tw`text-sm text-ellipsis overflow-hidden break-words truncate`}>
				<span class={tw`text-gray-100 font-medium`}>{title}</span>
				{/* <span class={tw`text-gray-200`}>{' '}- {slice}</span> */}
			</p>
		},
		editor: UnknownPostEditor,
		create: () => {}
	},
	art: {
		icon: Icon.image,
		content: (post) => {
			const content = post.data.title as string;
			return <p class={tw`text-(sm gray-100) font-medium
				text-ellipsis overflow-hidden break-words truncate`}>
				{content}
			</p>
		},
		editor: UnknownPostEditor,
		create: () => {}
	},
	UNKNOWN: {
		icon: Icon.close_circle,
		content: (post) => {
			return <p class={tw`text-(sm gray-200) font-medium italic
				text-ellipsis overflow-hidden break-words truncate`}>
				Post type '{post.type}' is unknown.
			</p>
		},
		editor: UnknownPostEditor,
	}
}

const MIN_IDLE_TIME = 1;
const MAX_SAVE_INTERAL = 10;

export const QUERY_SAVE_POST = `
	mutation($id: Int!, $data: String!, $tags: [String!], $slug: String) {
		indieweb {
			post(id: $id, data: $data, tags: $tags, slug: $slug)
		}
	}
`;

export default function PostsPage() {
	const navigate = useNavigate();
	const [ data ] = useData<GraphData>(QUERY_POSTS, []);
	const slug = location.pathname.split('/')[3] ?? '';
	const posts = (data.indieweb?.posts ?? []).map(post => ({ ...post, data: JSON.parse(post.data) }));

	if (!slug && posts.length) navigate(`/posts/${posts[0].slug}`, { replace: true });

	const serverPost = useStore<Post | null>(null);
	const post = useStore<Post | null>(null);

	const lastSaveTime = useRef<number>(0);
	const saveTimeout = useRef<number>(0);
	const saveState = useStore<SaveState>('idle');

	const event = useMemo(() => new EventEmitter() as PostEditorContextData['event'], []);

	function isDirty() {
		return JSON.stringify(post()) !== JSON.stringify(serverPost());
	}

	function updateSaveState(state: SaveState, reason: SaveReason) {
		saveState(state);
		event.emit('save', state, reason);
	}

	/**
	 * Attempts to submit changes to the server.
	 */

	function handleSubmitChanges(post: Post | null, reason: SaveReason) {
		if(!post) return;
		lastSaveTime.current = Date.now();
		updateSaveState('saving', reason);

		const saveStart = Date.now();
		const data = JSON.stringify(post.data);
		executeQuery(QUERY_SAVE_POST, {
			id: post.id,
			data,
			// TODO: Tags & stuff :)
			// tags: metadata().tags.split(' '),
			// slug: metadata().slug || defaultSlug,
		}).catch(e => {
			console.error('Failed to save! Retrying.');
			handleSave(null, true);
		}).then(() => {
			lastSaveTime.current = 0;
			serverPost(post);

			const IDLE_DELAY = 700;
			const MIN_UPDATE_DELAY = 300;

			function saveStateUpdater() {
				if (saveState() !== 'saving') return;
				updateSaveState('saved', reason);
				setTimeout(() => {
					if (saveState() !== 'saved') return;
					updateSaveState('idle', reason);
				}, IDLE_DELAY);
			}

			const now = Date.now();
			if (now - saveStart > MIN_UPDATE_DELAY) saveStateUpdater();
			else setTimeout(() => saveStateUpdater(), MIN_UPDATE_DELAY - (now - saveStart));
		});
	}

	/**
	 * Intelligently saves the post to the server, dirty checking, debouncing, and doing some deferred computation.
	 *
	 * @param newPost - If this is being called from an editor, this will be set either to a post object, or a
	 *  function to generate it which should be debounced. If it's an object, we should immediate dirty check and
	 *  discard if it is the same as the previous post object. If it's a function, we should queue the function to
	 *  execute at the end of the debounce, and do the dirty check there. If this is being called from THIS component,
	 *  this may be `null`. If this is the case, the current post should be saved, regardless of whether or not it's
	 * 	dirty. This is because this will only be called like this in the case of a network error.
	 * @param skipDebounce - If true, don't debounce, execute the save immediately.
	 */

	function handleSave(newPost: Post | (() => Post) | null, forceImmediate = false): boolean {
		clearTimeout(saveTimeout.current);

		let dirty = isDirty();

		if (newPost && !(newPost instanceof Function)) {
			post(newPost);
			if (!forceImmediate && !dirty) return false;
		}
		else if (!newPost) {
			newPost = post();
		}

		if (forceImmediate) {
			handleSubmitChanges(newPost instanceof Function ? newPost() : newPost, 'immediate');
			return dirty;
		}
		else {
			if (lastSaveTime.current === 0) lastSaveTime.current = Date.now();
			if ((Date.now() - lastSaveTime.current) / 1000 < MAX_SAVE_INTERAL - MIN_IDLE_TIME) {
				// We're not at the REQUIRED save time.
				saveTimeout.current = setTimeout(() => {
					newPost = newPost instanceof Function ? newPost() : newPost;
					post(newPost);
					if (!isDirty()) return;
					handleSubmitChanges(newPost, 'debounce');
				}, MIN_IDLE_TIME * 1000) as any as number;
				return true;
			}
			else {
				newPost = newPost instanceof Function ? newPost() : newPost;
				post(newPost);
				if (!isDirty()) return false;
				handleSubmitChanges(newPost, 'interval');
				return true;
			}
		}
	}


	/**
	 * Load the post.
	 */

	useAsyncEffect(async (abort) => {
		if (post() && isDirty()) handleSave(null, true);
		post(null);
		serverPost(null);

		if (!slug.length) return undefined;
		const res = (await executeQuery(QUERY_POST, { slug }))?.indieweb?.postBySlug;
		if (!res || abort.aborted) return false;
		const newPost = { ...res, data: JSON.parse(res.data) } as Post;
		serverPost(newPost);
		post(newPost);
	}, [ slug ]) as any as Post;

	const meta = POST_TYPE_META[post()?.type ?? ''] ?? POST_TYPE_META.UNKNOWN;
	const Editor = meta.editor;

	const sidebarOpen = useStore(true);

	return (
		<div class={tw`-mb-14`}>
			<div inert={!sidebarOpen()} class={tw`
				fixed w-72 top-0 left-14 z-50 flex-(& col) bg-gray-800 h-screen [scrollbar-gutter:stable]
				scroll-(bar-(transparent hover-gray-600 hocus:gray-700) gutter-gray-800) transition duration-200
				${!sidebarOpen() && '-translate-x-[24rem]'}`}>

				<div class={tw`shrink-0 border-b-(1 gray-900/50) h-14`}>
					<Button.Tertiary icon={Icon.arrow_circle_left} label='Back' size={9}
						class={tw`absolute top-2.5 left-3 transition bg-gray-700/75`}
						onClick={() => navigate('/')}/>
				</div>

				<div class={tw`grow overflow-(x-hidden y-auto) flex-(& col) pl-3 py-3 pr-0 gap-1`}>
					{posts.map((p, i) => {
						const meta = POST_TYPE_META[p.type] ?? POST_TYPE_META.UNKNOWN;
						return (
							<button class={tw`to-transparent flex flex-col p-2 pr-1 cursor-pointer transition rounded
								opacity-(70 hocus:100) hocus:bg-gray-700/40 relative text-left
								${p.slug === slug && `!(brightness-[120%] saturate-[90%] opacity-100 shadow bg-gray-700/70
									before:(absolute w-1 bg-accent-500/50 rounded -left-2 top-2 bottom-2)
								)`}`}
								onClick={() => navigate(`/posts/${p.slug}`)}
							>
								<div class={tw`mb-0.5 pb-px w-full overflow-hidden`}>{meta.content(p)}</div>

								<div class={tw`flex w-full justify-between`}>

									<p class={tw`font-bold text-xs text-gray-100/75 flex gap-1 -ml-px -mt-px pb-px`}>

										<div class={tw`w-max flex gap-1`}>
											<Svg src={meta.icon} size={4} class={tw`shrink-0 icon-s-gray-200 icon-p-gray-400 mt-0.5`}/>
											<span class={tw`pt-0.5 mt-px`}>{meta.label ?? titleCase(p.type)}</span>
											{/* <Tooltip bg='gray-600' class={tw`text-gray-100`}
												delay={700} label={meta.label ?? titleCase(post.type)} position='bottom' small/> */}
										</div>

										<span class={tw`opacity-30 px-0.5 pt-0.5 mt-px`}>•</span>

										<span class={tw``}>
											<span class={tw`inline-block pt-0.5 mt-px`}>
												{new Date(p.created * 1000).toLocaleDateString('en-US',
												{ month: 'short', day: '2-digit', year: 'numeric' })}</span>
											<Tooltip bg='gray-600' class={tw`text-gray-100`}
												delay={700} position='bottom' label={new Date(p.created * 1000)
												.toLocaleTimeString('en-us', { minute: 'numeric', hour: 'numeric' })} small/>
										</span>

										<span class={tw`opacity-30 px-0.5 pt-0.5 mt-px`}>•</span>

										<span class={tw`pt-0.5 mt-px`}>{titleCase(Visibility[p.visibility])}</span>
										{/* <Svg src={VISIBILITY_ICONS[post.visibility]}
											size={4} class={tw`shrink-0 mt-0.5 icon-p-gray-200 icon-s-gray-400`}/> */}
									</p>
								</div>

								{/* <p class={tw`pt-0.5 mt-0.5 break-words text-ellipsis relative w-max max-w-full
									truncate select-none overflow-hidden font-(mono bold) text-(xs gray-300)`}>
									{post.slug}
									<Tooltip bg='gray-600' class={tw`text-gray-100 font-(mono bold) text-xs`}
										position='bottom' delay={700} label={post.slug} small/>
								</p> */}

							</button>
						);
					})}
				</div>
			</div>
			<div class={tw`relative ${sidebarOpen() && 'ml-72'} transition-all duration-200`}>
				{post() && <PostEditorContext.Provider value={{
					event,
					post: post()!,
					serverPost: serverPost()!,
					setPost: handleSave,
					setSidebarVisible: sidebarOpen
				}}>
					<Editor key={post()!.id}/>
				</PostEditorContext.Provider>}
			</div>
		</div>
	)
}
