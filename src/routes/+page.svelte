<script>
	import Hero from '$lib/components/Hero.svelte';
</script>

<svelte:head>
	<title>Byte Charts - Visual Stories</title>
	<meta name="description" content="Byte Charts is a project focussing on visual stories" />
	<link rel="canonical" href="https://byte-charts.dev/" />
	<meta property="og:title" content="Byte Charts" />
	<meta property="og:description" content="Byte Charts is a project focussing on visual stories" />
	<meta property="og:url" content="https://byte-charts.dev/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="TODO: OG image URL" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="TODO: Twitter title" />
	<meta name="twitter:description" content="TODO: Twitter description" />
	<meta name="twitter:image" content="TODO: Twitter image URL" />

	{@html `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Byte Charts","url":"https://byte-charts.dev","logo":"TODO: logo URL","sameAs":[]}</script>`}
	{@html `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Byte Charts","url":"https://byte-charts.dev","potentialAction":{"@type":"SearchAction","target":"https://byte-charts.dev/blog?search={search_term_string}","query-input":"required name=search_term_string"}}</script>`}
</svelte:head>

<main>
	<div class="hero min-h-screen bg-base-100">
		<Hero />
		<div class=" hero-content mb-50 bg-base-200/50 p-10 text-center">
			<div class="max-w-md">
				<div class="text-center text-4xl md:text-5xl">
					<h1 class="text-center font-black tracking-normal">Work in Progress</h1>
				</div>
				<p class="mt-3 max-w-2xl text-base-content/70"></p>
			</div>
		</div>
	</div>
</main>

<style>
</style>
