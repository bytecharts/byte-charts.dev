<script>
	import BGPattern from '$lib/components/BGPattern.svelte';
	const { data } = $props();
	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const formatDate = (value) => {
		if (!value) return '';
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return formatter.format(parsed);
	};

	const allTags = Array.from(new Set(data.posts.flatMap((post) => post.meta?.tags ?? []))).sort(
		(a, b) => a.localeCompare(b)
	);

	const tagParam = data?.selectedTag ?? '';
	const selectedTag = decodeURIComponent(tagParam);

	const filteredPosts = selectedTag
		? data.posts.filter((post) => (post.meta?.tags ?? []).includes(selectedTag))
		: data.posts;
</script>

<main class="min-h-screen bg-base-100">
	<section class="px-6 py-16">
		<div class="relative mx-auto max-w-6xl">
			<header class="z-50 mb-12">
				<h1 class="text-4xl font-black tracking-tight sm:text-5xl">Blog</h1>
				<p class="mt-3 max-w-2xl text-base-content/70">
					Notes on data, sketches, and generative forms.
				</p>
			</header>

			<div class="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
				<aside
					class="z-50 border border-base-300 bg-base-100/80
					p-5"
				>
					<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">Tags</p>
					<ul class="mt-4 flex flex-wrap gap-2">
						<li>
							<a href="/blog" class={`badge badge-outline ${selectedTag ? '' : 'badge-neutral'}`}>
								All
							</a>
						</li>
						{#each allTags as tag}
							<li>
								<a
									href={`/blog?tag=${encodeURIComponent(tag)}`}
									class={`badge badge-outline ${selectedTag === tag ? 'badge-neutral' : ''}`}
								>
									{tag}
								</a>
							</li>
						{/each}
					</ul>
				</aside>

				<div class="grid gap-6">
					{#if filteredPosts.length === 0}
						<p class="text-base-content/60">No posts match this tag.</p>
					{:else}
						{#each filteredPosts as post}
							<article
								class=" hvr-lines-square grid gap-4 border
								border-base-300 bg-base-100/80 p-6"
							>
								{#if post.meta?.cover}
									<a href={`/blog/${post.slug}`} class="block">
										<img
											src={post.meta.cover}
											alt={post.meta?.title}
											loading="lazy"
											class="h-56 w-full object-cover"
										/>
									</a>
								{/if}
								<div class="flex flex-col gap-2">
									<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">
										{formatDate(post.meta?.date)}
									</p>
									<h2 class="text-2xl font-bold">
										<a href={`/blog/${post.slug}`} class="hvr-lines-square">
											{post.meta?.title}
										</a>
									</h2>
									{#if post.meta?.excerpt}
										<p class="text-base-content/70">{post.meta.excerpt}</p>
									{/if}
									{#if post.meta?.tags?.length}
										<div class="flex flex-wrap gap-2">
											{#each post.meta.tags as tag}
												<a
													href={`/blog?tag=${encodeURIComponent(tag)}`}
													class="badge badge-outline"
												>
													{tag}
												</a>
											{/each}
										</div>
									{/if}
								</div>
							</article>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</section>
</main>
