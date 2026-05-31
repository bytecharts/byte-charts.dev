<script>
	const { data } = $props();
	const Post = data.content;
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
</script>

<main class="bg-base-100">
	<section class="px-6 py-16">
		<div class="mx-auto max-w-3xl">
			<nav class="mb-8 text-sm">
				<a href="/blog" class="hvr-lines-square">Back to Blog</a>
			</nav>
			<header class="mb-10">
				<p class="text-xs uppercase tracking-[0.2em] text-base-content/50">
					{formatDate(data.meta?.date)}
				</p>
				<h1 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
					{data.meta?.title}
				</h1>
				{#if data.meta?.excerpt}
					<p class="mt-4 text-base-content/70">{data.meta.excerpt}</p>
				{/if}
			</header>
			{#if data.meta?.cover}
				<img
					src={data.meta.cover}
					alt={data.meta?.title}
					loading="lazy"
					class="mb-10 w-full object-cover"
				/>
			{/if}
			<article class="prose max-w-none">
				<svelte:component this={Post} />
			</article>
		</div>
	</section>
</main>
