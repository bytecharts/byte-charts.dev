<script>
	import Seo from '$lib/components/Seo.svelte';
	import { resolve } from '$app/paths';
	import { formatDate } from '$lib/blog.js';
	import { getBlogPostSeo } from '$lib/seo.js';

	const { data } = $props();
	const Post = data.content;
	const seo = getBlogPostSeo(data.meta, data.slug);
</script>

<Seo {...seo} />

<main class="about-page-hack bg-base-100">
	<section class="px-6 py-16">
		<div class="mx-auto max-w-3xl">
			<nav class="mb-8 text-sm">
				<a href={resolve('/blog')} class="hvr-lines-square-sm">Back to Blog</a>
			</nav>
			<header class="card-custom z-50 mb-10">
				{#if formatDate(data.meta?.date)}
					<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">
						{formatDate(data.meta?.date)}
					</p>
				{/if}
				<h1 class="mt-3 text-4xl font-black tracking-wide sm:text-5xl">
					{data.meta?.title}
				</h1>
				{#if data.meta?.excerpt}
					<p class="mt-3 max-w-2xl text-base-content/70">{data.meta.excerpt}</p>
				{/if}
			</header>
			{#if data.meta?.cover}
				<img
					src={data.meta.cover}
					alt=""
					loading="lazy"
					decoding="async"
					class="mb-10 w-full object-cover"
				/>
			{/if}
			<article class="prose max-w-none">
				<svelte:component this={Post} />
			</article>
		</div>
	</section>
</main>
