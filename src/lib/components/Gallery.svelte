<script>
	import { onDestroy, onMount } from 'svelte';
	import lightGallery from 'lightgallery';
	import 'lightgallery/css/lightgallery.css';
	import 'lightgallery/css/lg-zoom.css';
	import 'lightgallery/css/lg-fullscreen.css';
	import 'lightgallery/css/lg-video.css';

	const basePath = '/images/charts/gallery/static/';
	const toTitle = (file) =>
		file
			.replace(/\.(png|webp)$/i, '')
			.replace(/[_-]+/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());

	const files = [
		'static__5.png',
		'static__2.png',
		'static__19.png',
		'static__3.png',
		'static__8.png',
		'static__6.webp',
		'static__4.png',
		'static__0.png',
		'static__10.png',
		'static__11.png',
		'static__12.png',
		'static__13.png',
		'static__14.png',
		'static__15.png',
		'static__18.png',
		'static__1.png',
		'static__21.webp',
		'static__22.webp',
		'static__23.png',
		'static__24.webp',
		'static__7.png'
	];

	const items = files.map((file) => ({
		src: `${basePath}/${file}`,
		title: '#' + toTitle(file)
	}));

	const videoItem = [
		{
			src: '/videos/Chasing_Love.mp4',
			title: 'Chasing Love in Hollywood Rom-coms',
			isVideo: true,
			videoSize: '1280-720',
			poster: '/videos/Chasing_Love.jpg'
		},
		{
			src: '/videos/OBEs.mp4',
			title: 'Out of Body Experiences and their stories',
			isVideo: true,
			videoSize: '1280-720',
			poster: '/videos/OBEs.jpg'
		},
		{
			src: '/videos/Manta_Rays_H.mp4',
			title: 'Manta Rays Observations off the coast of Australia',
			isVideo: true,
			poster: '/videos/Manta_Rays.jpg'
		},
		{
			src: '/videos/IPL_Team_Valuations.mp4',
			title: 'IPL Team Valuations',
			isVideo: true,
			videoSize: '1280-720',
			poster: '/videos/IPL_Team_Valuations.jpg'
		}
	];

	const galleryItems = [...videoItem, ...items];

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
			class=" card-custom relative mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
		>
			<div class="">
				<h1 class="text-4xl font-black tracking-tight sm:text-5xl">Data Viz Gallery</h1>
				<p class="mt-3 max-w-2xl text-base-content/70">
					A curated collection of data visualisations from public challenges like the
					#30DayChartChallenge and #TidyTuesday
				</p>
			</div>
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
