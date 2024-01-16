import { h } from 'preact';
import { Post } from '../common/Type';
import { Button, Card, Icon, tw } from 'dashboard';

export default function UnknownPostEditor({ post }: { post: Post }) {
	return (
		<Card class={tw`max-w-2xl my-12 mx-auto h-min`}>
			<Card.Body class={tw`flex-(& col) items-center py-12 px-24`}>
				<p class={tw`text-gray-200 mb-2 font-medium`}>Missing editor for post type '{post.type}'.</p>
				<p class={tw`text-gray-300 text-sm`}>Please check that the required plugins are loaded.</p>
			</Card.Body>
		</Card>
	);
}
