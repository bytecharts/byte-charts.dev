<script>
	const { data } = $props();
	const Post = data.content;
	const canonical = `https://byte-charts.dev/blog/${data.slug ?? ''}`;
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

<svelte:head>
	<title>{data.meta?.title ?? 'TODO: Page Title'} — Byte Charts</title>
	<meta name="description" content={data.meta?.excerpt ?? 'TODO: Meta description'} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={data.meta?.title ?? 'TODO: OG title'} />
	<meta property="og:description" content={data.meta?.excerpt ?? 'TODO: OG description'} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:image" content={data.meta?.cover ?? 'TODO: OG image URL'} />
	<meta property="article:published_time" content={data.meta?.date} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta?.title ?? 'TODO: Twitter title'} />
	<meta name="twitter:description" content={data.meta?.excerpt ?? 'TODO: Twitter description'} />
	<meta name="twitter:image" content={data.meta?.cover ?? 'TODO: Twitter image URL'} />
	{@html `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: data.meta?.title ?? 'TODO', datePublished: data.meta?.date, description: data.meta?.excerpt ?? 'TODO', image: data.meta?.cover ?? 'TODO', url: canonical, author: { '@type': 'Person', name: 'TODO: Author name' }, publisher: { '@type': 'Organization', name: 'Byte Charts', logo: { '@type': 'ImageObject', url: 'TODO: logo URL' } } })}</script>`}
</svelte:head>

<main class="about-page-hack bg-base-100">
	<section class="px-6 py-16">
		<div class="mx-auto max-w-3xl">
			<nav class="mb-8 text-sm">
				<a href="/blog" class="hvr-lines-square">Back to Blog</a>
			</nav>
			<header class="mb-10">
				<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">
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
