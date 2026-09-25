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
		<div class="z-10 hero mb-50 max-w-[100vw] bg-base-100/70 p-8 text-center">
			<div class="text-center">
				<div class="text-center text-5xl md:text-7xl">
					<h1 class="text-center font-black tracking-tight">
						<span class="blur-[2.75px]">Bringing</span>
						<span
							class="relative z-10 bg-yellow-300 px-2
							tracking-tight">attention</span
						>
						<span class="blur-[2.75px]">to numbers</span>
					</h1>
				</div>

				<p class="mt-3 text-center text-lg text-base-content/70">Data · Visuals · Stories</p>

				<div class="mt-4 flex justify-center">
					<a href="/gallery" class="main-link text-2xl tracking-tight">
						<span class="hvr-lines-square p-2">Look closer →</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.main-link {
		font-family: 'Space Grotesk', sans;
		font-weight: 700;
		background-color: transparent;
		background-image: none;
	}
</style>
