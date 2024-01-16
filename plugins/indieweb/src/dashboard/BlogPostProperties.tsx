import { h } from 'preact';
import { Field, Form, tw } from 'dashboard';
import { BlogPostRevision, Post } from '../common/Type';

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

interface Props {
	post: Post;
	setPost: (post: Post) => void;

	defaultSlug: string;
	defaultPreview: string;
	defaultDescription: string;
}

export default function BlogPostProperties(props: Props) {
	return (
		<Form<BlogPostRevision> class={tw`flex-(& col) gap-4`}
			value={props.post as any} onChange={(newMeta) => {}}
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
							placeholder={props.defaultSlug}
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
						placeholder={props.defaultDescription}
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
						placeholder={props.defaultDescription}
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
	);
}
