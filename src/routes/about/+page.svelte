<script>
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';
	import { onMount } from 'svelte';

	const seo = getStaticSeo('about');
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://tally.so/widgets/embed.js';
		script.onload = () => window.Tally?.loadEmbeds();
		document.body.appendChild(script);
	});
</script>

<Seo {...seo} />

<main class="about-page-hack min-h-screen px-6 py-16">
	<div class="mx-auto max-w-6xl">
		<header class="card-custom z-50 mb-6">
			<h1
				class="text-4xl font-black tracking-wide
				sm:text-5xl"
			>
				Behind the Numbers
			</h1>
		</header>
		<div class="space-y-2">
			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" />

				<div class="collapse-title text-3xl font-black sm:text-4xl">Who</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Byte Charts is
						<a
							href="https://rand-net.dev"
							class="hvr-lines-square [display:inline] no-underline"
							target="_blank">Sathish</a
						>, one person turning numbers into visuals that pull them into focus.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" checked />

				<div class="collapse-title text-3xl font-black sm:text-4xl">Why</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Numbers are everywhere. Seeing what they contain is another matter. Data visualization
						makes patterns, comparisons, and stories visible.
					</p>
					<br />
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						I’ve been fascinated by that gap since 2019, after a lecture by Shirley Wu. In 2026, I
						decided to commit to closing it full-time.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" />

				<div class="collapse-title text-3xl font-black sm:text-4xl">What</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Static graphics, interactive tools, motion graphics. I work at the intersection of
						design, code, and motion. The same dataset might end up as more than one of these.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-8 border border-base-content/10 bg-base-100 p-4 sm:p-4">
			<div class="text-3xl font-black sm:text-4xl">Send me your numbers</div>

			<p class="prose mt-4 leading-relaxed text-base-content/80 lg:prose-xl">
				Let's figure out what they're trying to say.
			</p>
			<iframe
				data-tally-src="https://tally.so/embed/9qeJ04?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
				loading="lazy"
				width="100%"
				height="300"
				frameBorder="0"
				marginHeight="0"
				marginWidth="0"
				title="Send me your numbers"
			></iframe>

			<p class="m-4 prose leading-relaxed text-base-content/60 lg:prose-xl">
				Prefer email? Reach me at
				<a
					href="mailto:contact@byte-charts.dev"
					class="hvr-lines-square [display:inline] no-underline">contact@byte-charts.dev</a
				>.
			</p>
		</div>

		<div class="mt-8 border border-base-content/10 bg-base-100 p-4 sm:p-4">
			<div class=" text-3xl font-black sm:text-4xl">Works that hold my attention</div>

			<div class="mt-4 divide-y divide-base-content/10">
				<a
					href="https://surbhibhatia.com/"
					target="_blank"
					rel="noopener noreferrer"
					class="items-left flex flex-col justify-between py-4 text-base-content transition-opacity hover:opacity-60"
				>
					<span class="font-medium">Surbhi Bhatia</span>
					<span class="text-sm text-base-content/50">Data Journalist</span>
				</a>

				<a
					href="https://diagramchasing.fun/"
					target="_blank"
					rel="noopener noreferrer"
					class="items-left flex flex-col justify-between py-4 text-base-content transition-opacity hover:opacity-60"
				>
					<span class="font-medium">Diagram Chasing | Aaman Bhargava</span>
					<span class="text-sm text-base-content/50">Visual Stories about India</span>
				</a>
				<a
					href="https://deepalikank.in/"
					target="_blank"
					rel="noopener noreferrer"
					class="items-left flex flex-col justify-between py-4 text-base-content transition-opacity hover:opacity-60"
				>
					<span class="font-medium">Deepali Kank </span>
					<span class="text-sm text-base-content/50">Data analyst and visual storyteller</span>
				</a>
			</div>
		</div>
	</div>
</main>

<style>
	[data-theme='bc-dark'] iframe[data-tally-src] {
		filter: invert(0.9) hue-rotate(180deg);
		background: transparent;
	}
</style>
