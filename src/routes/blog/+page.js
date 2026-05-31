import { loadPosts } from '$lib/blog';

export const load = async ({ url }) => {
	const posts = await loadPosts();
	return { posts, selectedTag: url.searchParams.get('tag') ?? '' };
};
