<script>
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/blog.js';
	import { SITE_URL, getStaticSeo } from '$lib/seo.js';
	import { resolve } from '$app/paths';

	const { data } = $props();

	const canonicalBase = `${SITE_URL}/blog`;
	const canonical = data?.selectedTag
		? `${canonicalBase}?tag=${encodeURIComponent(data.selectedTag)}`
		: canonicalBase;
	const seo = { ...getStaticSeo('blog'), url: canonical, noindex: Boolean(data?.selectedTag) };

	const allTags = Array.from(new Set(data.posts.flatMap((post) => post.meta?.tags ?? []))).sort(
		(a, b) => a.localeCompare(b)
	);

	// URLSearchParams.get() already decodes, so use the value as-is (trimmed).
	const selectedTag = (data?.selectedTag ?? '').trim();

	const filteredPosts = selectedTag
		? data.posts.filter((post) => (post.meta?.tags ?? []).includes(selectedTag))
		: data.posts;
</script>

<Seo {...seo} />

<main class="min-h-screen bg-base-100">
	<section class="px-6 py-16">
		<div class="relative mx-auto max-w-6xl">
			<header class="card-custom z-50 mb-12">
				<h1 class="text-4xl font-black tracking-wide sm:text-5xl">Notes</h1>
				<p class="mt-3 max-w-2xl text-base-content/70">
					Ideas, sketches, observations, and other things I find interesting.
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
							<a
								href={resolve('/blog')}
								aria-current={!selectedTag ? 'true' : undefined}
								class={`pressable inline-block px-1 py-0.5 text-sm text-base-content `}
							>
								<span class="hvr-lines-square-sm" class:current-tab={!selectedTag}>All</span>
							</a>
						</li>
						{#each allTags as tag (tag)}
							<li>
								<a
									href={resolve(`/blog?tag=${encodeURIComponent(tag)}`)}
									aria-current={selectedTag === tag ? 'true' : undefined}
									class={`pressable inline-block px-1 py-0.5 text-sm text-base-content `}
								>
									<span class="hvr-lines-square-sm" class:current-tab={selectedTag === tag}>
										{tag}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				</aside>

				<div class="grid gap-6">
					{#if filteredPosts.length === 0}
						<p class="text-base-content/60">
							No posts match this tag.
							<a href={resolve('/blog')} class="link font-semibold link-hover">Show all posts</a>
						</p>
					{:else}
						{#each filteredPosts as post (post.slug)}
							<article
								class=" hvr-lines-square relative grid gap-4 border
								border-base-300 bg-base-100/80 p-6"
							>
								{#if post.meta?.cover}
									<img
										src={post.meta.cover}
										alt=""
										loading="lazy"
										decoding="async"
										class="h-56 w-full object-cover"
									/>
								{/if}
								<div class="flex flex-col gap-2">
									{#if formatDate(post.meta?.date)}
										<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">
											{formatDate(post.meta?.date)}
										</p>
									{/if}
									<h2 class="text-2xl font-bold">
										{post.meta?.title}
									</h2>
									{#if post.meta?.excerpt}
										<p class="text-base-content/70">{post.meta.excerpt}</p>
									{/if}
									{#if post.meta?.tags?.length}
										<div class="relative z-10 flex flex-wrap gap-2">
											{#each post.meta.tags as tag (tag)}
												<a
													href={resolve(`/blog?tag=${encodeURIComponent(tag)}`)}
													class="badge badge-outline"
												>
													{tag}
												</a>
											{/each}
										</div>
									{/if}
								</div>
								<a
									href={resolve(`/blog/${post.slug}`)}
									class="absolute inset-0"
									aria-label={`Read: ${post.meta?.title}`}
								></a>
							</article>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</section>
</main>
