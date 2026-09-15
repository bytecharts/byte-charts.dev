<script>
	import GalleryMasonry from '$lib/components/GalleryMasonry.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';

	const seo = getStaticSeo('gallery');
</script>

<Seo {...seo} />

<main class="bg-base-100">
	<GalleryMasonry />
</main>
