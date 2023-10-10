import { h } from 'preact';
import { Post } from '../common/Type';
import { Button, Card, Icon, tw } from 'dashboard';

export default function UnknownPostEditor({ post }: { post: Post }) {
	return (
		<Card class={tw`max-w-3xl my-10 mx-auto h-min`}>
			<Card.Body class={tw`flex-(& col) items-center py-8 px-24`}>
				<p class={tw`text-gray-200 mb-4`}>Missing editor for post type '{post.type}'.</p>
				<Button.Secondary label='Back' icon={Icon.arrow_circle_left} to='/posts'/>
			</Card.Body>
		</Card>
	);
}
