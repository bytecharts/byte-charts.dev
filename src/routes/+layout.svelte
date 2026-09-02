<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BGPattern from '$lib/components/BGPattern.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
	<link rel="shortcut icon" href="/images/favicon.ico" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Byte Charts - Blog on data visualization</title>
	<meta name="description" content="TODO: Global fallback meta description" />
	<meta property="og:site_name" content="Byte Charts" />
	<meta property="og:locale" content="en_US" />
</svelte:head>

<BGPattern class="fixed inset-0 z-0" />
<div class="mx-auto max-w-[100rem]">
	<Header />
	{@render children()}
	<Footer />
</div>
