<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/seo.js';

	const status = $derived(page.status);
	const title = $derived(
		status === 404 ? 'Page not found - Byte Charts' : `Something went wrong - Byte Charts`
	);
</script>

<Seo
	{title}
	description="The page you are looking for does not exist or an error occurred."
	url={page.url.href}
	image={`${SITE_URL}/images/byte-charts.webp`}
	noindex={true}
/>

<main class="min-h-screen bg-base-100">
	<section class="px-6 py-16">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs tracking-[0.2em] text-base-content/50 uppercase">{status}</p>
			<h1 class="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
				{status === 404 ? 'Page not found' : 'Something went wrong'}
			</h1>
			<p class="mt-4 text-base-content/70">
				{status === 404
					? 'The page you are looking for does not exist.'
					: 'An unexpected error occurred. Please try again.'}
			</p>
			<a href={resolve('/')} class="btn mt-8 btn-neutral">Back to home</a>
		</div>
	</section>
</main>
