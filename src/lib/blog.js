const normalizeTags = (tags) => {
	if (!tags) return [];
	const rawList = Array.isArray(tags) ? tags : [tags];
	return rawList
		.flatMap((tag) => String(tag).split(','))
		.map((tag) => tag.trim())
		.filter(Boolean);
};

const toTimestamp = (value) => {
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export const loadPosts = async () => {
	const modules = import.meta.glob('/src/content/blog/*.{md,svx}');
	const entries = await Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const post = await resolver();
			const meta = post.metadata ?? {};
			return {
				slug: path
					.split('/')
					.pop()
					.replace(/\.(md|svx)$/, ''),
				meta: {
					...meta,
					tags: normalizeTags(meta.tags)
				},
				content: post.default
			};
		})
	);

	return entries.sort((a, b) => toTimestamp(b.meta?.date) - toTimestamp(a.meta?.date));
};
