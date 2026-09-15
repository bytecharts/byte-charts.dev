<script>
	let {
		title,
		description,
		url,
		image,
		type = 'website',
		publishedTime = undefined,
		noindex = false,
		jsonLd = undefined
	} = $props();

	let jsonLdMarkup = $derived(
		jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + 'script>' : ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta property="og:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}

	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}

	{#if jsonLdMarkup}
		{@html jsonLdMarkup}
	{/if}
</svelte:head>
