<script>
	import Hero from '$lib/components/Hero.svelte';
</script>

<main>
	<div class="hero min-h-screen bg-base-100">
		<Hero />
		<div class="hero-content mb-50 bg-base-100 p-10 text-center shadow-sm">
			<div class="max-w-md">
				<h1 class="text-3xl font-black md:text-5xl">Byte Charts</h1>
				<p class="py-6">
					Exploring <a href="/gallery" class="link">data visualization</a>, generative art.
				</p>
			</div>
		</div>
		<div
			role="alert"
			class="absolute right-4 bottom-4 z-50 alert max-w-xs bg-base-100/40
			text-left backdrop-blur"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-info-icon lucide-info"
				><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
			>
			<span class="text-sm">AI was used for generating charts and patterns in the canvas</span>
		</div>
	</div>
</main>

<style>
</style>
