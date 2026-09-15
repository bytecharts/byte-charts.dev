<script>
	import Seo from '$lib/components/Seo.svelte';
	import { getStaticSeo } from '$lib/seo.js';

	const seo = getStaticSeo('about');
</script>

<Seo {...seo} />

<main class="about-page-hack min-h-screen px-6 py-16">
	<div class="mx-auto max-w-6xl">
		<header class="card-custom z-50 mb-6">
			<h1
				class="text-4xl font-black tracking-wide
				sm:text-5xl"
			>
				Perspective
			</h1>
		</header>
		<div class="space-y-2">
			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" />

				<div class="collapse-title text-3xl font-black sm:text-4xl">Who</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Byte Charts is a data visualization studio creating visual stories from complex
						information, run by Sathish. I combine data visualization, motion graphics, 3D and
						interactive design to communicate complex ideas clearly.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" checked />

				<div class="collapse-title text-3xl font-black sm:text-4xl">Why</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Numbers are elusive and abstract. Turning something abstract into a picture makes
						comprehension easier. It gives better insights into patterns, relationships and feedback
						loops.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" />

				<div class="collapse-title text-3xl font-black sm:text-4xl">What</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Byte Charts turns data and complex information into visual stories through
						visualization, motion and interactive design.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-content/10 bg-base-100">
				<input type="checkbox" />

				<div class="collapse-title text-3xl font-black sm:text-4xl">How</div>

				<div class="collapse-content">
					<p class="prose leading-relaxed text-base-content/80 lg:prose-xl">
						Byte Charts is where I explore that intersection—and create visualizations for people
						and organizations that have something complex to communicate.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-8 border border-base-content/10 bg-base-100 p-4 sm:p-4">
			<div class=" text-3xl font-black sm:text-4xl">Let's visualize it</div>

			<p class="prose mt-4 leading-relaxed text-base-content/80 lg:prose-xl">
				I can help turn a dataset, idea or story into an animated visualization, interactive
				experience, 3D sequence, or something entirely different.
			</p>

			<p class="prose mt-4 leading-relaxed text-base-content/80 lg:prose-xl">
				Have a dataset, story or complex idea that needs to be visualized? Let's work together.
			</p>
		</div>

		<div class="mt-8 border border-base-content/10 bg-base-100 p-4 sm:p-4">
			<div class=" text-3xl font-black sm:text-4xl">People whose work I keep coming back to.</div>

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
				<a
					href="https://shreyamaheshwari.framer.website/"
					target="_blank"
					rel="noopener noreferrer"
					class="items-left flex flex-col justify-between py-4 text-base-content transition-opacity hover:opacity-60"
				>
					<span class="font-medium">Shreya Maheswari </span>
					<span class="text-sm text-base-content/50">Brand & Type Designer</span>
				</a>
			</div>
		</div>
	</div>
</main>
