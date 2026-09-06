<script>
	import { onMount } from 'svelte';
	import { darkTheme } from '$lib/stores/theme.js';

	let isDark = false;
	let canvas;
	let container;
	let ctx;
	let width = 0;
	let height = 0;
	let cols = 0;
	let rows = 0;

	// Static chart thumbnails + video, revealed with a pixelation effect behind the canvas grid.
	// duration is per-slide milliseconds. Videos default to their full runtime.
	const slides = [
		{ src: '/videos/Climate_Stripes_SFX.mp4', type: 'video' },
		{ src: '/images/charts/gallery/thumbs/static__0.webp', type: 'image', duration: 5500 },
		{ src: '/images/charts/gallery/thumbs/static__23.webp', type: 'image', duration: 5500 },
		{ src: '/images/charts/gallery/thumbs/static__3.webp', type: 'image', duration: 5500 },
		{ src: '/images/charts/gallery/thumbs/static__8.webp', type: 'image', duration: 5500 },
		{ src: '/images/charts/gallery/thumbs/static__1.webp', type: 'image', duration: 5500 }
	];

	const SLIDE_INTERVAL = 5500;
	const REVEAL_DURATION = 1000;
	const MAX_PIXEL_BLOCK = 48;

	onMount(() => {
		// ============================================
		// CONFIG
		// ============================================

		const cellSize = 8;

		if (!canvas || !container) return;

		ctx = canvas.getContext('2d');

		function setSize() {
			if (!canvas || !container) return;

			const rect = container.getBoundingClientRect();
			const nextWidth = Math.max(1, Math.floor(rect.width));
			const nextHeight = Math.max(1, Math.floor(rect.height));

			if (nextWidth === width && nextHeight === height) return;

			width = nextWidth;
			height = nextHeight;
			canvas.width = width;
			canvas.height = height;
			cols = Math.floor(width / cellSize);
			rows = Math.floor(height / cellSize);
		}

		// ============================================
		// THEMES
		// ============================================

		const themes = {
			dark: {
				bg: '#000',
				grid: '#222',

				shades: (v) => `rgb(${v},${v},${v})`
			},

			light: {
				bg: '#fff',
				grid: '#ddd',

				shades: (v) => {
					const i = 255 - v;

					return `rgb(${i},${i},${i})`;
				}
			}
		};

		function theme() {
			return isDark ? themes.dark : themes.light;
		}

		// ============================================
		// GRID
		// ============================================

		function drawGrid() {
			const t = theme();

			// Transparent background so the thumbnail slideshow shows through.
			octx.clearRect(0, 0, width, height);

			octx.save();
			octx.globalAlpha = 0.22;
			octx.strokeStyle = t.grid;

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					octx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
			octx.restore();
		}

		// ============================================
		// OVERLAY (grid, pre-rendered once)
		// ============================================

		const overlay = document.createElement('canvas');
		const octx = overlay.getContext('2d');

		function renderOverlay() {
			overlay.width = width;
			overlay.height = height;
			drawGrid();
		}

		// ============================================
		// PIXELATED SLIDESHOW
		// ============================================

		const loaders = slides.map((slide) => {
			if (slide.type === 'video') {
				const video = document.createElement('video');
				video.muted = true;
				video.loop = false;
				video.playsInline = true;
				video.preload = 'auto';
				video.src = slide.src;
				video.addEventListener('loadedmetadata', () => {
					// Metadata may arrive after the slot was scheduled — reschedule with full duration.
					if (loaders[slideIndex] === video) scheduleNext();
				});
				return video;
			}
			const img = new Image();
			img.decoding = 'async';
			img.src = slide.src;
			return img;
		});

		const pixelCanvas = document.createElement('canvas');
		const pctx = pixelCanvas.getContext('2d');

		let slideIndex = 0;
		let slideStart = performance.now();

		const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

		const COLOR_REVEAL_DURATION = 3000;

		function sourceDims(source) {
			if (source instanceof HTMLVideoElement) {
				if (source.readyState < 2 || !source.videoWidth) return null;
				return { w: source.videoWidth, h: source.videoHeight };
			}
			if (!source.complete || !source.naturalWidth) return null;
			return { w: source.naturalWidth, h: source.naturalHeight };
		}

		function blit(source, sw, sh, dx, dy, dw, dh, pixelated, progress, filter) {
			ctx.save();
			ctx.filter = filter;

			if (pixelated) {
				const block = Math.max(1, Math.ceil(MAX_PIXEL_BLOCK * (1 - easeOutCubic(progress))));
				const tw = Math.max(1, Math.ceil(dw / block));
				const th = Math.max(1, Math.ceil(dh / block));
				pixelCanvas.width = tw;
				pixelCanvas.height = th;
				pctx.drawImage(source, 0, 0, sw, sh, 0, 0, tw, th);
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(pixelCanvas, 0, 0, tw, th, dx, dy, dw, dh);
				ctx.imageSmoothingEnabled = true;
			} else {
				ctx.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);
			}

			ctx.restore();
		}

		function isVideoSlide(index) {
			return loaders[index] instanceof HTMLVideoElement;
		}

		function playActiveVideo() {
			const active = loaders[slideIndex];
			if (active instanceof HTMLVideoElement) {
				active.play().catch(() => {});
			}
		}

		function pauseVideo(index) {
			const source = loaders[index];
			if (source instanceof HTMLVideoElement) {
				source.pause();
			}
		}

		function drawPhoto() {
			const source = loaders[slideIndex];
			const dims = source ? sourceDims(source) : null;
			if (!dims) return;

			// Contain-fit, centered.
			const scale = Math.min(width / dims.w, height / dims.h);
			const dw = Math.max(1, Math.floor(dims.w * scale));
			const dh = Math.max(1, Math.floor(dims.h * scale));
			const dx = Math.floor((width - dw) / 2);
			const dy = Math.floor((height - dh) / 2);

			const now = performance.now();
			const pixelProgress = Math.min(1, (now - slideStart) / REVEAL_DURATION);
			const colorProgress = Math.min(
				1,
				Math.max(0, (now - slideStart - REVEAL_DURATION) / COLOR_REVEAL_DURATION)
			);

			// Grayscale base, pixelated while revealing.
			blit(
				source,
				dims.w,
				dims.h,
				dx,
				dy,
				dw,
				dh,
				pixelProgress < 1,
				pixelProgress,
				'grayscale(1) blur(2px)'
			);

			// Slow color fade once the image is in focus.
			if (colorProgress > 0) {
				ctx.save();
				ctx.globalAlpha = easeOutCubic(colorProgress);
				blit(source, dims.w, dims.h, dx, dy, dw, dh, false, 1, 'blur(2px)');
				ctx.restore();
			}
		}

		// Animation loop runs only during reveal + color fade, then stops to save CPU.
		// Video slides keep animating for their full slot since every frame is new.
		let raf = 0;
		let animating = false;

		function paint() {
			if (!ctx || cols === 0 || rows === 0) return;
			ctx.clearRect(0, 0, width, height);
			drawPhoto();
			ctx.drawImage(overlay, 0, 0);
		}

		function frame() {
			paint();
			if (
				isVideoSlide(slideIndex) ||
				performance.now() - slideStart < REVEAL_DURATION + COLOR_REVEAL_DURATION
			) {
				raf = requestAnimationFrame(frame);
			} else {
				animating = false;
			}
		}

		function kick() {
			if (!animating) {
				animating = true;
				raf = requestAnimationFrame(frame);
			}
		}

		setSize();
		renderOverlay();
		playActiveVideo();
		kick();

		function slotDuration() {
			const slide = slides[slideIndex];
			if (typeof slide.duration === 'number' && slide.duration > 0) return slide.duration;
			const active = loaders[slideIndex];
			if (active instanceof HTMLVideoElement && Number.isFinite(active.duration)) {
				return Math.max(1000, active.duration * 1000);
			}
			return SLIDE_INTERVAL;
		}

		let timer = 0;

		function scheduleNext() {
			clearTimeout(timer);
			timer = setTimeout(advance, slotDuration());
		}

		function advance() {
			pauseVideo(slideIndex);
			slideIndex = (slideIndex + 1) % slides.length;
			slideStart = performance.now();
			playActiveVideo();
			kick();
			scheduleNext();
		}

		scheduleNext();
		const resizeObserver = new ResizeObserver(() => {
			setSize();
			renderOverlay();
			paint();
		});
		resizeObserver.observe(container);
		const unsubscribe = darkTheme.subscribe((value) => {
			isDark = value;
			renderOverlay();
			paint();
		});

		return () => {
			cancelAnimationFrame(raf);
			animating = false;
			clearTimeout(timer);
			pauseVideo(slideIndex);
			resizeObserver.disconnect();
			unsubscribe();
		};
	});
</script>

<div class="hero-canvas" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.hero-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	canvas {
		display: block;
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
	}
</style>
