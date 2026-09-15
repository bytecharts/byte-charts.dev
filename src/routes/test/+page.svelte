<script>
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';

	const seo = { ...getStaticSeo('home'), title: 'Test - Byte Charts', noindex: true };
</script>

<Seo {...seo} />
