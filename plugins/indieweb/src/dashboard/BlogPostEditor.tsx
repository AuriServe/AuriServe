import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { EditorState } from 'prosemirror-state';
import { ProseMirror } from '@nytimes/react-prosemirror';
import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { tw, executeQuery, Button, Icon, useNavigate, Form, Field, merge } from 'dashboard';

import initialize from './prose';
import { Post } from '../common/Type';
import { MediaImageField } from 'media';
import EditorToolbar from './prose/EditorToolbarPopup';
import HeadingNavigation from './prose/HeadingNavigation';
import TextStyle, { DEFAULT_TEXT_STYLES } from './prose/TextStyle';
import { useStore } from 'vibin-hooks';
import LinkEditorPopup from './prose/LinkEditorPopup';
import { AutocompleteAction } from 'prosemirror-autocomplete';
import SlashCommandPopup from './prose/SlashCommandPopup';

interface Props {
	post: Post;
	setFullscreen: (fullscreen: boolean) => void;
}

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

const SIDEBAR_INPUT_CLASSES = {
	'': tw`
		--input-background[rgb(var(--theme-gray-800))]
		hover:--input-background[color-mix(in_srgb,rgb(var(--theme-gray-800))_50%,rgb(var(--theme-gray-input)))]
		--input-background-focus[rgb(var(--theme-gray-input))]
	`,
	// input: tw`!transition-none`,
	// highlight: tw`hidden`
}

const SIDEBAR_TEXTAREA_CLASSES = {
	...SIDEBAR_INPUT_CLASSES,
	container: tw`!h-full`
}

const DEFAULT_DESCRIPTION_MAX_LENGTH = 300;
const DEFAULT_SLUG_MAX_LENGTH = 48;

const PROPS_PANE_WIDTH = 'calc(min(min(50vw-20rem,36rem),100vw-64rem))';

function makeSlug(text: string) {
	let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
	const long = slug.length > DEFAULT_SLUG_MAX_LENGTH;
	slug = slug.substring(0, DEFAULT_SLUG_MAX_LENGTH) + (long ? '' : '_');
	const lastUnderscore = slug.lastIndexOf('_');
	if (lastUnderscore === -1) return slug;
	return slug.substring(0, lastUnderscore);
}

export default function BlogPostEditor({ post, setFullscreen: showPostsSidebar }: Props) {
	const showLinkEditor = useRef<(edit?: boolean) => void>(() => {});
	const commandsHook = useRef<(action: AutocompleteAction) => boolean>(() => false);

	const navigate = useNavigate();
	const mount = useStore<HTMLElement | null>(null);
	const editorState = useStore(() => {
		const container = document.createElement('div');
		container.innerHTML = `<h1>${post.data.title}</h1>${post.data.content}`;

		const [ schema, plugins ] = initialize({
			forceTitle: true,
			titleLevel: 1,
			numHeadings: 10,
			textStyles: TEXT_STYLES,
			hooks: {
				commands: commandsHook
			}
		});

		return EditorState.create({
			doc: DOMParser.fromSchema(schema).parse(container),
			plugins
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
		description: post.data.description ?? '',
		preview: post.data.preview ?? '',
		banner: post.data.banner ?? -1
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

	function setFullscreen(fullscreen: boolean) {
		propertiesOpen(!fullscreen);
		showPostsSidebar(!fullscreen);
	}

	function handleSave() {
		const fragment = DOMSerializer.fromSchema(editorState().schema).serializeFragment(editorState().doc.content);
		const title = (fragment.firstChild as HTMLElement).innerText;
		fragment.removeChild(fragment.firstChild as HTMLElement);
		const div = document.createElement('div');
		div.appendChild(fragment)
		const content = div.innerHTML;

		const data = JSON.stringify({ ...post.data, title, content });
		executeQuery(QUERY_SAVE_POST, {
			id: post.id,
			data,
			tags: metadata().tags.split(' '),
			slug: metadata().slug || defaultSlug,
		})
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
			dispatchTransaction={tr => editorState(s => s.apply(tr))}
		>
			<div class={tw`w-full min-h-screen flex -mb-14 transition
				${propertiesOpen() ? 'bg-gray-800/20' : 'bg-gray-800/50'}`}>

				<aside inert={!propertiesOpen()} class={tw`fixed top-0 ${propertiesOpen() ? 'translate-x-0' :
					`-translate-x-[${PROPS_PANE_WIDTH}] opacity-0 interact-none`} border-x-(1 gray-900/75)
					w-[${PROPS_PANE_WIDTH}] h-screen flex-(& col) z-40 bg-gray-900 shadow-md transition duration-200`}>

					<Button.Secondary icon={Icon.launch} label='Publish' size={9} iconRight
						class={tw`absolute top-2.5 right-4 ml-0.5 z-50 transition !bg-accent-500/[15%]`}
						onClick={handleSave}/>

					<div class={tw`border-b-(1 gray-900/75) bg-gray-800/60 h-14 shrink-0`}/>

					<div class={tw`p-4 bg-gray-800/60 grow`}>
						<Form<ReturnType<typeof metadata>> class={tw`flex-(& col) gap-4`}
							value={metadata()} onChange={(newMeta) => metadata(newMeta as any)}
						>
							<figure>
								<figcaption class={tw`sr-only`}>
									Properties
								</figcaption>
								<div class={tw`grid-(& cols-3) gap-4 items-stretch`}>
									{/* <MediaImageField
										path='banner'
										aspect={16/9}
									/> */}
									<div class={tw`col-span-3 flex-(&) gap-4 place-content-between`}>
										<Field.Text
											path='slug'
											multiline
											optional
											description={'A unique string used to identify the post, which will appear in its URL.'}
											placeholder={defaultSlug}
											class={{
												...SIDEBAR_INPUT_CLASSES,
												text: tw`pt-6 pb-px font-(mono bold) text-[0.8rem] --input-color[rgb(var(--theme-gray-200))]
													text-ellipsis`
											}}
										/>
										<Field.Text
											path='tags'
											multiline
											optional
											minRows={1.5}
											description='A space separated list of tags, used to filter posts.'
											placeholder=' '
											class={{
												...SIDEBAR_INPUT_CLASSES,
												text: tw`pt-6 pb-px font-(mono bold) text-[0.8rem] --input-color[rgb(var(--theme-gray-200))]
													text-ellipsis`
											}}
										/>
										{/* <div class={tw`grid-(& cols-3) gap-4`}>
											<Field.DateTime
												path='publishTime'
												optional
												description='The date this article was first published. Set automatically, but may be modified.'
												class={{
													...SIDEBAR_INPUT_CLASSES
												}}
											/>
											<Field.DateTime
												path='lastEditTime'
												description='The last time this article was modified. May be omitted.'
												class={{
													...SIDEBAR_INPUT_CLASSES
												}}
											/>
											<Field.DateTime
												path='creationTime'
												description='The canonical time this article was created. Used for historical uploads.'
												class={{
													...SIDEBAR_INPUT_CLASSES
												}}
											/>
										</div> */}
									</div>
								</div>
							</figure>

							<figure class={tw``}>
								<figcaption class={tw`sr-only`}>
									Metadata
								</figcaption>

								<div class={tw`grid-(& cols-1) gap-4 items-stretch min-h-[12rem]`}>
									<Field.Text
										path='description'
										description='A short description of the post which will display in search engines and on social media.'
										placeholder={defaultDescription}
										class={{
											...SIDEBAR_TEXTAREA_CLASSES,
											text: tw`pt-6 pb-0.5 text-sm font-medium --input-color[rgb(var(--theme-gray-200))] hyphens-auto`,
											pre: tw`line-clamp-5 peer-focus:line-clamp-none`
										}}
										// hideLabel
										optional
										multiline
									/>
									<Field.Text
										path='preview'
										description='A short preview of the post which will display in various places,
											such as the blog index, or the dashboard.'
										placeholder={defaultDescription}
										class={{
											...SIDEBAR_TEXTAREA_CLASSES,
											text: tw`pt-6 pb-0.5 text-sm font-medium --input-color[rgb(var(--theme-gray-200))] hyphens-auto`,
											pre: tw`line-clamp-5 peer-focus:line-clamp-none`,
										}}
										// hideLabel
										optional
										multiline
									/>
								</div>
							</figure>

						</Form>
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
					<SlashCommandPopup onAction={commandsHook}/>
				</main>

				{/* <Button.Tertiary icon={Icon.tag} label='Open Right Sidebar' iconOnly size={9} disabled={rightSidebarOpen()}
					class={tw`fixed top-2.5 right-32 mr-1 z-30 bg-gray-750`}
					onClick={() => rightSidebarOpen(r => !r)}/> */}

				<Button.Secondary icon={Icon.launch} label='Publish' size={9} iconRight
					class={tw`fixed top-2.5 right-2.5 ml-0.5 z-50 transition !bg-accent-500/[15%]
						${propertiesOpen() && 'opacity-0 interact-none'}`}
					onClick={handleSave}/>
			</div>
		</ProseMirror>
	);
}
