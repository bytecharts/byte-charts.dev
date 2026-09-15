<script>
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';

	const seo = getStaticSeo('home');
</script>

<Seo {...seo} />

<main>
	<div class="relative hero min-h-screen bg-base-100">
		<Hero />
		<div class=" relative hero-content z-10 mb-50 bg-base-100/50 p-10 text-center">
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
