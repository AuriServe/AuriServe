import { h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'preact/hooks';
import { EditorState, Transaction } from 'prosemirror-state';
import { ProseMirror } from '@nytimes/react-prosemirror';
import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { tw, executeQuery, Button, Icon, useNavigate, Form, Field, merge, Spinner } from 'dashboard';

import initializeBlogEditorData from './prose';
import { BlogPost, Post } from '../common/Type';
import { MediaImageField } from 'media';
import EditorToolbar from './prose/EditorToolbarPopup';
import HeadingNavigation from './prose/HeadingNavigation';
import TextStyle, { DEFAULT_TEXT_STYLES } from './prose/TextStyle';
import { useStore } from 'vibin-hooks';
import LinkEditorPopup from './prose/LinkEditorPopup';
import { AutocompleteAction } from 'prosemirror-autocomplete';
import SlashCommandPopup from './prose/SlashCommandPopup';
import BlogPostProperties from './BlogPostProperties';
import { PostEditorContext } from './PostEditorContext';
import EmojiSearchPopup from './prose/EmojiSearchPopup';

export const QUERY_SAVE_POST = `
	mutation($id: Int!, $data: String!, $tags: [String!], $slug: String) {
		indieweb {
			post(id: $id, data: $data, tags: $tags, slug: $slug)
		}
	}
`;

const TEXT_STYLES: TextStyle[] = [
	...DEFAULT_TEXT_STYLES,
	{ baseTag: 'strong', class: 'jitter', split: true },
	{ baseTag: 'em', class: 'bounce', split: true },
	{ baseTag: 'em', class: 'gradient' }
];

const DEFAULT_DESCRIPTION_MAX_LENGTH = 300;
const DEFAULT_SLUG_MAX_LENGTH = 48;

const PROPS_PANE_WIDTH = 'calc(min(42rem,100vw-78rem))';

function makeSlug(text: string) {
	let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
	const long = slug.length > DEFAULT_SLUG_MAX_LENGTH;
	slug = slug.substring(0, DEFAULT_SLUG_MAX_LENGTH) + (long ? '' : '_');
	const lastUnderscore = slug.lastIndexOf('_');
	if (lastUnderscore === -1) return slug;
	return slug.substring(0, lastUnderscore);
}

export default function BlogPostEditor() {
	const { post, event: postEvents, setPost, setSidebarVisible } = useContext(PostEditorContext);

	const showLinkEditor = useRef<(edit?: boolean) => void>(() => {});
	const commandHook = useRef<(action: AutocompleteAction) => boolean>(() => false);
	const emojiHook = useRef<(action: AutocompleteAction) => boolean>(() => false);

	let blogPost = post.data as BlogPost;
	let rev = 0;

	const mount = useStore<HTMLElement | null>(null);
	const editorData = useMemo(() => initializeBlogEditorData({
		forceTitle: true,
		titleLevel: 1,
		numHeadings: 10,
		textStyles: TEXT_STYLES,
		hooks: {
			command: commandHook,
			emoji: emojiHook
		}
	}), []);

	const editorState = useStore(() => {
		const container = document.createElement('div');
		container.innerHTML = `<h1>${blogPost.revisions[rev]?.title ?? ''}</h1>${blogPost.revisions[rev]?.content ?? ''}`;

		return EditorState.create({
			doc: DOMParser.fromSchema(editorData.editorSchema).parse(container),
			plugins: editorData.plugins
		});
	});

	const metadata = useStore<{
		tags: string;
		slug: string;
		description: string;
		preview: string;
		banner: number;
	}>({
		tags: (post.tags ?? []).join(' '),
		slug: ((post.slug ?? ''), ''),
		description: blogPost.revisions[rev]?.description ?? '',
		preview: blogPost.revisions[rev]?.preview ?? '',
		banner: blogPost.revisions[rev]?.banner ?? -1
	});

	let defaultDescription = '';
	let defaultSlug = '';

	if (!metadata().description || !metadata().preview || !metadata().slug) {
		if (post.slug) defaultSlug = post.slug;

		editorState().doc.forEach(child => {
			if (child.type.name === 'title' && !defaultSlug) {
				defaultSlug = makeSlug(child.textContent);
				return;
			}

			if (defaultDescription.length < DEFAULT_DESCRIPTION_MAX_LENGTH) {
				defaultDescription += `${child.textContent}\n`;
			}
		});

		defaultDescription = defaultDescription.trim().substring(0, DEFAULT_DESCRIPTION_MAX_LENGTH);
		let lastSpace = defaultDescription.lastIndexOf(' ');
		if (lastSpace === -1) lastSpace = defaultDescription.length;
		const ellipsize = lastSpace < defaultDescription.length;
		defaultDescription = defaultDescription.substring(0, lastSpace);
		if (ellipsize) defaultDescription += '...';
	}

	const navigationOpen = useStore(true);
	const propertiesOpen = useStore(true);

	const saveIndicatorState = useStore<'idle' | 'saved' | 'saving'>('idle');

	function setFullscreen(fullscreen: boolean) {
		propertiesOpen(!fullscreen);
		setSidebarVisible(!fullscreen);
	}

	useEffect(() => postEvents.bind('save', (state, reason) => {
		if (reason === 'interval' && saveIndicatorState() === 'idle') return;
		saveIndicatorState(state);
	}), [ postEvents ]);

	const computeDocument = useCallback((): Post => {
		let fragment = DOMSerializer.fromSchema(editorData.editorSchema).serializeFragment(editorState().doc.content);
		const title = (fragment.firstChild as HTMLElement).innerText;
		fragment.removeChild(fragment.firstChild as HTMLElement);
		let div = document.createElement('div');
		div.appendChild(fragment)
		const content = div.innerHTML;

		fragment = DOMSerializer.fromSchema(editorData.pageSchema).serializeFragment(editorState().doc.content);
		fragment.removeChild(fragment.firstChild as HTMLElement);
		div = document.createElement('div');
		div.appendChild(fragment)
		const html = div.innerHTML;

		fragment = DOMSerializer.fromSchema(editorData.simpleSchema).serializeFragment(editorState().doc.content);
		fragment.removeChild(fragment.firstChild as HTMLElement);
		div = document.createElement('div');
		div.appendChild(fragment);
		const preview = div.innerHTML;

		const newPost = { ...post };
		const newData: BlogPost = newPost.data = { ...newPost.data } as BlogPost;
		newData.revisions = [ ...newData.revisions ];
		const revision = newData.revisions[rev] = { ...newData.revisions[rev] };

		revision.title = title;
		revision.content = content;
		revision.preview = preview;
		revision.description = preview;
		newData.html = html;

		return newPost;
	}, [ post, rev ]);

	useEffect(() => {
		const saveCheckCallback = (evt: KeyboardEvent) => {
			if (evt.key === 's' && evt.ctrlKey) {
				evt.preventDefault();
				evt.stopPropagation();
				setPost(computeDocument(), true);
			}
		}

		window.addEventListener('keydown', saveCheckCallback);
		return () => window.removeEventListener('keydown', saveCheckCallback);
	}, [ computeDocument ]);

	function handleModified(tr: Transaction) {
		editorState(s => s.apply(tr));
		setPost(computeDocument);
	}

	useEffect(() => {
		document.documentElement.classList.add(tw`!scroll-gutter-gray-700`);
		return () => document.documentElement.classList.remove(tw`!scroll-gutter-gray-700`);
	}, []);

	useEffect(() => {
		if (!mount()) return;
		const classes = tw`prose-lg max-w-[51.75rem]`;
		if (!navigationOpen() && !propertiesOpen()) mount()!.classList.add(...classes.split(' '));
		else mount()!.classList.remove(...classes.split(' '));
	}, [ navigationOpen(), propertiesOpen(), mount() ]);

	return (
		<ProseMirror
			mount={mount()}
			state={editorState()}
			dispatchTransaction={handleModified}
		>
			<div class={tw`w-full min-h-screen flex -mb-14 transition
				${propertiesOpen() ? 'bg-gray-800/20' : 'bg-gray-800/50'}`}>

				<aside inert={!propertiesOpen()} class={tw`fixed top-0 ${propertiesOpen() ? 'translate-x-0' :
					`-translate-x-[${PROPS_PANE_WIDTH}] opacity-0 interact-none`} border-x-(1 gray-900/75)
					w-[${PROPS_PANE_WIDTH}] h-screen flex-(& col) z-40 bg-gray-900 shadow-md transition duration-200`}>

					<Button.Secondary icon={Icon.launch} label='Publish' size={9} iconRight
						class={tw`absolute top-2.5 right-4 ml-0.5 z-50 transition !bg-accent-500/[15%]`}
						onClick={() => console.warn('Nothing yet!')}/>

					<div class={tw`border-b-(1 gray-900/75) bg-gray-800/60 h-14 shrink-0`}/>

					<div class={tw`p-4 bg-gray-800/60 grow`}>
						<BlogPostProperties
							post={post}
							setPost={setPost}
							defaultSlug={defaultSlug}
							defaultPreview={defaultDescription}
							defaultDescription={defaultDescription}
						/>
					</div>
				</aside>

				<aside inert={!navigationOpen()}
					class={tw`fixed z-20 top-0 left-14 ${navigationOpen() && !propertiesOpen() ? 'translate-x-0' :
						'translate-x-[-36rem] interact-none'} w-72 h-screen z-30 bg-gray-800 shadow-md duration-200`}>

					<Button.Tertiary icon={Icon.book} label='Close Left Sidebar' iconOnly size={9} disabled={!navigationOpen()}
						class={tw`absolute top-2.5 right-2.5 bg-gray-700/75 duration-100
						${navigationOpen() ? 'opacity-100' : '!opacity-0'}`}
						onClick={() => navigationOpen(l => !l)}/>
					<div class={tw`border-b-(1 gray-900/50) h-14 mb-3`}/>
					<div class={tw`p-2.5`}>
						<HeadingNavigation/>
					</div>
				</aside>

				<Button.Tertiary icon={Icon.arrow_circle_left} label='Back' size={9}
					class={tw`fixed z-30 top-2.5 ml-14 left-2.5 transition
						${navigationOpen() ? 'bg-gray-700/75' : 'bg-gray-750'}`}
					onClick={() => setFullscreen(false)}/>

				<Button.Tertiary icon={Icon.book} label='Open Left Sidebar' iconOnly size={9} disabled={navigationOpen()}
					class={tw`fixed top-2.5 left-40 ml-2 z-10 bg-gray-750`}
					onClick={() => navigationOpen(l => !l)}/>

				<main
					class={tw`grow p-8 transition-all overflow-visible duration-200
						${propertiesOpen() ? `ml-[${PROPS_PANE_WIDTH}]` : navigationOpen() ? 'ml-80' : 'ml-0'}`}
					onMouseUp={() => setFullscreen(true)}
				>
					<div key={'wrap'} ref={mount} class={tw`
						w-full mx-auto outline-0 pb-[45vh] max-w-[46rem] transition-all duration-75
						caret-accent-300/75 leading-8 selection:bg-accent-400/10
						prose
						prose-headings:(text-gray-100 font-medium)
						prose-h1:(text-[1.8em] mt-8 mb-3)
						prose-h2:(text-[1.8em] mt-7 mb-2.5)
						prose-h3:(text-[1.55em] mt-6 mb-2)
						prose-h4:(text-[1.4em] mt-5 mb-1.5)
						prose-h5:(text-[1.3em] mt-4 mb-1)
						prose-h6:(text-[1.2em] mt-3 mb-0.5)
						prose-p:(text-gray-200 my-4 font-[450])
						prose-strong:(text-gray-100)
						prose-pre:(text-gray-200)
						prose-code:(text-gray-200 font-bold)
						prose-hr:(my-8 border-t-(2 gray-600) mx-10)
						prose-blockquote:(not-italic border-gray-500 prose-p:text-gray-300)
						prose-a:(text-accent-300 underline decoration-([5px] accent-300/20) no-decoration-skip underline-offset-[-2px])
						prose-hr:after:(!bg-gray-600 !h-0.5 !w-[90%] !mx-auto)
						prose-img:(rounded-xl mx-auto my-6 max-w-none w-full)
						prose-blockquote:prose-p:before:content-none
						prose-code:(before:content-none after:content-none)
					`}
					/>
					<EditorToolbar styles={TEXT_STYLES} showLinkEditor={() => showLinkEditor.current(true)}/>
					<LinkEditorPopup show={showLinkEditor}/>
					<SlashCommandPopup onAction={commandHook}/>
					<EmojiSearchPopup onAction={emojiHook}/>
				</main>

				{/* <Button.Tertiary icon={Icon.tag} label='Open Right Sidebar' iconOnly size={9} disabled={rightSidebarOpen()}
					class={tw`fixed top-2.5 right-32 mr-1 z-30 bg-gray-750`}
					onClick={() => rightSidebarOpen(r => !r)}/> */}

				<div inert={propertiesOpen()} class={tw`${propertiesOpen() && 'opacity-0 interact-none'}
					fixed top-2.5 right-2.5 z-50 transition flex gap-2`}>

					<div class={tw`relative grid pt-1.5 pr-2`}>
						<p class={tw`row-start-1 col-start-1 transition duration-200 text-right
							${saveIndicatorState() === 'saved' ? 'delay-100' : saveIndicatorState() === 'saving'
								? 'translate-y-1 opacity-0 !duration-0' : '-translate-y-1 opacity-0'}`}>
							<span class={tw`font-medium text-gray-300`}>Saved.</span>
						</p>

						<p class={tw`row-start-1 col-start-1 transition duration-200 text-right
							${saveIndicatorState() === 'saving' ? 'delay-100' : saveIndicatorState() === 'saved'
								? '-translate-y-1 opacity-0 !duration-0' : 'translate-y-1 opacity-0'}`}>
							<span class={tw`font-medium text-gray-300 animate-pulse`}>Saving...</span>
						</p>
					</div>

					<Button.Secondary icon={Icon.launch} label='Publish' size={9} iconRight
						class={tw`ml-0.5 !bg-accent-500/[15%]`} onClick={() => console.warn('Nothing yet!')}/>
				</div>



			</div>
		</ProseMirror>
	);
}
