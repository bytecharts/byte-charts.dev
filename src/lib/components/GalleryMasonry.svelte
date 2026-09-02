<script>
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
			poster: '/videos/Chasing_Love.jpg'
		},
		{
			src: '/videos/OBEs.mp4',
			title: 'Out of Body Experiences and their stories',
			isVideo: true,
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
			poster: '/videos/IPL_Team_Valuations.jpg'
		}
	];

	const galleryItems = [...videoItem, ...items];

	let selectedItem = null;

	function openModal(item) {
		selectedItem = item;
		document.getElementById('gallery_modal')?.showModal();
	}
</script>

<section class="px-6 py-16">
	<div class="mx-auto max-w-6xl">
		<div
			class="card-custom relative mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
		>
			<div class="">
				<h1 class="text-4xl font-black tracking-wide sm:text-5xl">Visual Stories</h1>
				<p class="mt-3 max-w-2xl text-base-content/70">
					A curated collection of work from public challenges like #30DayChartChallenge and
					#TidyTuesday, exploring patterns and stories that emerge from the data.
				</p>
			</div>
		</div>

		<div class="columns-1 gap-6 sm:columns-2 lg:columns-3">
			{#each galleryItems as item}
				<button
					type="button"
					class="gallery-card group relative mb-6 block w-full break-inside-avoid overflow-hidden border border-base-300 bg-base-100/80 text-left"
					on:click={() => openModal(item)}
				>
					{#if item.isVideo}
						<img
							src={item.poster}
							alt={item.title}
							loading="lazy"
							class="gallery-image block w-full"
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
					{:else}
						<img
							src={item.src}
							alt={item.title}
							loading="lazy"
							class="gallery-image block w-full"
						/>
					{/if}
					<div
						class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<span class="text-sm font-medium text-white">{item.title}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<dialog id="gallery_modal" class="modal">
	<div class="modal-box max-w-4xl p-0">
		{#if selectedItem}
			{#if selectedItem.isVideo}
				<video src={selectedItem.src} controls autoplay playsinline class="w-full"></video>
			{:else}
				<img src={selectedItem.src} alt={selectedItem.title} class="w-full" />
			{/if}
			<div class="p-4">
				<h3 class="text-lg font-bold">{selectedItem.title}</h3>
			</div>
		{/if}
		<form method="dialog">
			<button class="btn btn-circle btn-sm absolute right-2 top-2">✕</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.gallery-card {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		padding: 1em;
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
</style>
