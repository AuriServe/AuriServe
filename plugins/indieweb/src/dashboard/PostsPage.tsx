// import { h } from 'preact';
// import { useAsyncMemo } from 'vibin-hooks';
// import { Spinner, executeQuery, tw, useLocation, useNavigate } from 'dashboard';

// import PostListPage from './PostListPage';
// import PostEditorPage from './PostEditorPage';

// import { Post } from '../common/Type';

// export const QUERY_POST = `query($slug: String!) {
// 	indieweb { postBySlug(slug: $slug) { id, slug, type, created, modified, visibility, data, tags, media } } }`;

// export default function PostsPage() {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	const slug = location.pathname.split('/')[2] ?? '';
// 	const post = useAsyncMemo(async () => {
// 		if (!slug.length) return undefined;
// 		const res = (await executeQuery(QUERY_POST, { slug }))?.indieweb?.postBySlug;
// 		if (!res) return false;
// 		return { ...res, data: JSON.parse(res.data) } as Post;
// 	}, { default: undefined, cacheOnUpdate: false }, [ slug ]);
// 	if (post === false) navigate('/posts');

// 	if (post) return <PostEditorPage post={post}/>
// 	else if (slug.length) return <Spinner size={12} class={tw`mx-auto my-16`}/>
// 	return <PostListPage/>
// }
