<script>
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';

	const seo = getStaticSeo('contact');
</script>

<Seo {...seo} />

<main class="about-page-hack min-h-screen px-6 py-16">
	<div class="mx-auto max-w-6xl">
		<header class="card-custom z-50 mb-6">
			<h1 class="text-4xl font-black tracking-wide sm:text-5xl">Contact</h1>
		</header>

		<div class="border border-base-content/10 bg-base-100 p-4 text-left sm:p-4">
			<div class="text-3xl font-black sm:text-4xl">Let's visualize it</div>

			<p class="prose mt-4 leading-relaxed text-base-content/80 lg:prose-xl">
				Have a dataset, story, or complex idea that needs visualizing? Send a note with the project
				context, timeline, and desired format.
			</p>

			<a
				class="mt-4 inline-block link text-lg font-semibold link-hover"
				href="mailto:contact@byte-charts.dev"
			>
				contact@byte-charts.dev
			</a>
		</div>
	</div>
</main>
