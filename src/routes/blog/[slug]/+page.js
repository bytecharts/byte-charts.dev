import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const modules = import.meta.glob('/src/content/blog/*.{md,svx}');
	const match = Object.entries(modules).find(([path]) => path.endsWith(`/${params.slug}.md`) || path.endsWith(`/${params.slug}.svx`));

	if (!match) {
		throw error(404, 'Post not found');
	}

	const post = await match[1]();
	return { slug: params.slug, meta: post.metadata ?? {}, content: post.default };
};
