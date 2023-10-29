import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { EditorState } from 'prosemirror-state';
import { ProseMirror } from '@nytimes/react-prosemirror';
import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { tw, executeQuery, Button, Icon, useNavigate, Form, Field } from 'dashboard';

import initialize from './prose';
import { Post } from '../common/Type';
import { MediaImageField } from 'media';
import EditorToolbar from './prose/EditorToolbar';
import HeadingNavigation from './prose/HeadingNavigation';
import TextStyle, { DEFAULT_TEXT_STYLES } from './prose/TextStyle';
import { useStore } from 'vibin-hooks';

interface Props {
	post: Post;
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
	'.': tw`
		--input-background[rgb(var(--theme-gray-900))]
		hover:--input-background[color-mix(in_srgb,rgb(var(--theme-gray-800))_50%,rgb(var(--theme-gray-input)))]
		--input-background-focus[rgb(var(--theme-gray-input))]
	`,
	input: tw`!transition-none`,
	highlight: tw`hidden`
}

const DEFAULT_DESCRIPTION_MAX_LENGTH = 300;
const DEFAULT_SLUG_MAX_LENGTH = 48;

function makeSlug(text: string) {
	let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
	const long = slug.length > DEFAULT_SLUG_MAX_LENGTH;
	slug = slug.substring(0, DEFAULT_SLUG_MAX_LENGTH) + (long ? '' : '_');
	const lastUnderscore = slug.lastIndexOf('_');
	if (lastUnderscore === -1) return slug;
	return slug.substring(0, lastUnderscore);
}

export default function BlogPostEditor({ post }: Props) {
	const navigate = useNavigate();
	const mount = useStore<HTMLElement | null>(null);
	const editorState = useStore(() => {
		const container = document.createElement('div');
		container.innerHTML = `<h1>${post.data.title}</h1>${post.data.content}`;

		const [ schema, plugins ] = initialize({
			forceTitle: true,
			titleLevel: 1,
			numHeadings: 5,
			textStyles: TEXT_STYLES
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

	const leftSidebarOpen = useStore(true);
	const rightSidebarOpen = useStore(true);

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
		if (!leftSidebarOpen() && !rightSidebarOpen()) mount()!.classList.add(...classes.split(' '));
		else mount()!.classList.remove(...classes.split(' '));
	}, [ leftSidebarOpen(), rightSidebarOpen(), mount() ]);

	return (
		<ProseMirror
			mount={mount()}
			state={editorState()}
			dispatchTransaction={tr => editorState(s => s.apply(tr))}
		>
			<div class={tw`w-full min-h-screen flex -mb-14 bg-gray-800/50`}>
				<Button.Tertiary icon={Icon.arrow_circle_left} label='Back' size={9}
					class={tw`fixed top-2.5 left-16 ml-0.5 z-50 transition
						${leftSidebarOpen() ? 'bg-gray-700/75' : 'bg-gray-750'}`}
					onClick={() => navigate('.')}/>

				<Button.Tertiary icon={Icon.book} label='Open Left Sidebar' iconOnly size={9} disabled={leftSidebarOpen()}
					class={tw`fixed top-2.5 left-40 ml-2 z-30 bg-gray-750`}
					onClick={() => leftSidebarOpen(l => !l)}/>

				<aside class={tw`fixed top-0 ${leftSidebarOpen() ? 'left-14' : '-left-72'}
					w-72 h-screen z-40 bg-gray-800 shadow-md transition-all duration-200`}>
					<Button.Tertiary icon={Icon.book} label='Close Left Sidebar' iconOnly size={9} disabled={!leftSidebarOpen()}
						class={tw`absolute top-2.5 right-2.5 bg-gray-700/75 duration-100
						${leftSidebarOpen() ? 'opacity-100' : '!opacity-0'}`}
						onClick={() => leftSidebarOpen(l => !l)}/>
					<div class={tw`border-b-(1 gray-900/50) h-14 mb-3`}/>
					<div class={tw`p-2.5`}>
						<HeadingNavigation/>
					</div>
				</aside>


				<main class={tw`grow p-8 transition-all overflow-visible
					${leftSidebarOpen() ? 'ml-80' : rightSidebarOpen() ? 'ml-0' : 'ml-0'}
					${rightSidebarOpen() ? 'mr-80' : leftSidebarOpen() ? 'mr-0' : 'ml-0'}`}>
					<div key={'wrap'} ref={mount} class={tw`
						w-full mx-auto outline-0 pb-[45vh] max-w-[46rem] transition-all duration-75
						prose-(&)
						selection:(bg-[rgba(0,0,0,0)])
						leading-8
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
						prose-code:(text-gray-200)
						prose-a:(text-accent-300 underline decoration-([5px] accent-300/20) no-decoration-skip underline-offset-[-2px])
						prose-hr:after:(!bg-gray-600 !h-0.5 !w-[90%] !mx-auto)
						prose-img:(rounded-xl mx-auto my-6 max-w-none w-full)
						prose-blockquote:prose-p:before:content-none
						prose-code:(before:content-none after:content-none)
					`}
					/>
					<EditorToolbar styles={TEXT_STYLES}/>
				</main>

				<Button.Tertiary icon={Icon.tag} label='Open Right Sidebar' iconOnly size={9} disabled={rightSidebarOpen()}
					class={tw`fixed top-2.5 right-32 mr-1 z-30 bg-gray-750`}
					onClick={() => rightSidebarOpen(r => !r)}/>

				<Button.Secondary icon={Icon.launch} label='Publish' size={9} iconRight
					class={tw`fixed top-2.5 right-2.5 ml-0.5 z-50 transition
						${rightSidebarOpen() ? 'bg-accent-400/[15%]' : 'bg-accent-500/10'}`}
					onClick={handleSave}/>

				<aside class={tw`fixed top-0 ${rightSidebarOpen() ? 'right-0' : '-right-80'}
					w-72 h-screen z-40 bg-gray-800 shadow-md transition-all duration-200`}>
					<Button.Tertiary icon={Icon.tag} label='Close Right Sidebar' iconOnly size={9} disabled={!rightSidebarOpen()}
						class={tw`absolute top-2.5 left-2.5 bg-gray-700/75 duration-100
						${rightSidebarOpen() ? 'opacity-100' : '!opacity-0'}`}
						onClick={() => rightSidebarOpen(r => !r)}/>
					<div class={tw`border-b-(1 gray-900/50) h-14 mb-3`}/>
					<div class={tw`p-2.5 pt-0`}>
						<Form<ReturnType<typeof metadata>> class={tw`flex-(& col) gap-2.5`} description='left'
							value={metadata()} onChange={(newMeta) => metadata(newMeta as any)}
						>
							<MediaImageField
								path='banner'
								aspect={16/9}
							/>
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
								// hideLabel
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
								// hideLabel
							/>
							<Field.Text
								path='description'
								description='A short description of the post which will display in search engines and on social media.'
								placeholder={defaultDescription}
								class={{
									...SIDEBAR_INPUT_CLASSES,
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
									...SIDEBAR_INPUT_CLASSES,
									text: tw`pt-6 pb-0.5 text-sm font-medium --input-color[rgb(var(--theme-gray-200))] hyphens-auto`,
									pre: tw`line-clamp-5 peer-focus:line-clamp-none`,
								}}
								// hideLabel
								optional
								multiline
							/>
						</Form>
					</div>
				</aside>

				{/* <aside class={tw`w-80 shrink-0 bg-gray-800 border-l-(1 gray-700)`}>
					<div class={tw`sticky top-0 p-8`}>
						<Button.Secondary label='Save' onClick={handleSave}/>
					</div>
				</aside> */}
			</div>
		</ProseMirror>
	);
}
