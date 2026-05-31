<script>
	import { onDestroy, onMount } from 'svelte';
	import lightGallery from 'lightgallery';
	import 'lightgallery/css/lightgallery.css';
	import 'lightgallery/css/lg-zoom.css';
	import 'lightgallery/css/lg-fullscreen.css';
	import 'lightgallery/css/lg-video.css';

	const basePath = '/images/charts/30Day2026';
	const toTitle = (file) =>
		file
			.replace(/\.(png|webp)$/i, '')
			.replace(/[_-]+/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());

	const files = [
		'22_new_tool.png',
		'24_scmp.png',
		'12_flowing-data.webp',
		'28_modeling.png',
		'23_seasons.png',
		'13_ecosystems.webp',
		'17_remake.png',
		'21_historical.png',
		'19_evolution.png',
		'14_trade.webp',
		'11_physical.webp',
		'30_ghde.png',
		'29_monochrome.png',
		'big_cats_of_india_conservation.png',
		'18_unicef.png',
		'08_circular.webp',
		'02_pictogram.webp',
		'01_part-to-whole.webp'
	];

	const items = files.map((file) => ({
		src: `${basePath}/${file}`,
		title: '#' + toTitle(file)
	}));

	const videoItem = {
		src: '/videos/charts/30day2026/20_global_change_color.mp4',
		title: '#20 Global Change',
		isVideo: true,
		videoSize: '1280-720',
		poster: '/videos/charts/30day2026/20_global_change_color.png'
	};

	const galleryItems = [videoItem, ...items];

	let galleryEl;
	let galleryInstance;

	onMount(async () => {
		const lgZoom = (await import('lightgallery/plugins/zoom')).default;
		const lgFullscreen = (await import('lightgallery/plugins/fullscreen')).default;
		const lgVideo = (await import('lightgallery/plugins/video')).default;

		if (!galleryEl) return;
		galleryInstance = lightGallery(galleryEl, {
			plugins: [lgZoom, lgFullscreen, lgVideo],
			speed: 300,
			selector: '.gallery-item',
			download: false
		});
	});

	onDestroy(() => {
		galleryInstance?.destroy();
	});
</script>

<section class="px-6 py-16">
	<div class="mx-auto max-w-6xl">
		<div
			class="relative z-50 mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
		>
			<div>
				<h1 class="text-4xl font-black tracking-tight sm:text-5xl">Gallery</h1>
				<p class="mt-3 max-w-2xl text-base-content/70">
					A curated set from the 30 Day 2026 charts challenge.
				</p>
			</div>
			<span class="badge badge-outline">30 Day 2026</span>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" bind:this={galleryEl}>
			{#each galleryItems as item}
				<figure class="gallery-card z-50 overflow-hidden border border-base-300 bg-base-100/80">
					<div class="aspect-[4/3] overflow-hidden bg-base-200">
						{#if item.isVideo}
							<a
								class="gallery-item gallery-item--video"
								data-sub-html={item.title}
								data-lg-size={item.videoSize}
								data-video={JSON.stringify({
									source: [{ src: item.src, type: 'video/mp4' }],
									attributes: { preload: 'metadata', playsinline: true, controls: true }
								})}
								data-poster={item.poster}
								aria-label={`Play ${item.title}`}
							>
								<div class="gallery-video-thumb">
									<img
										src={item.poster}
										alt={item.title}
										loading="lazy"
										class="gallery-image h-full w-full object-cover"
									/>
									<div class="gallery-video-overlay">
										<svg viewBox="0 0 24 24" aria-hidden="true" class="gallery-video-icon">
											<path
												fill="currentColor"
												d="M8 5.14v13.72a1 1 0 0 0 1.52.86l10.29-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14z"
											/>
										</svg>
										<span class="gallery-video-label">Video</span>
									</div>
								</div>
							</a>
						{:else}
							<a href={item.src} class="gallery-item" data-sub-html={item.title}>
								<img
									src={item.src}
									alt={item.title}
									loading="lazy"
									class="gallery-image h-full w-full object-contain"
								/>
							</a>
						{/if}
					</div>
					<figcaption class="p-4 text-sm font-semibold text-base-content/80">
						{item.title}
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	.gallery-card {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.gallery-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 40px -30px rgba(0, 0, 0, 0.35);
	}

	.gallery-image {
		transition: transform 0.3s ease;
	}

	.gallery-card:hover .gallery-image {
		transform: scale(1.05);
	}

	.gallery-item--video {
		display: block;
		height: 100%;
		color: #e6edf3;
	}

	.gallery-video-thumb {
		position: relative;
		height: 100%;
	}

	.gallery-video-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		gap: 8px;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.55));
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.7rem;
	}

	.gallery-video-icon {
		width: 3rem;
		height: 3rem;
	}

	.gallery-video-label {
		font-weight: 700;
	}

	:global(.lg-backdrop) {
		background: rgba(12, 16, 24, 0.55) !important;
		backdrop-filter: blur(14px);
	}

	:global(.lg-outer) {
		backdrop-filter: blur(0);
	}
</style>
