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

	let videoSrc = '/videos/backdrop.mp4';

	onMount(() => {
		// ============================================
		// CONFIG
		// ============================================

		const cellSize = 8;
		const PAD = 0;

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

		function hexToRgb(hex) {
			const value = hex.replace('#', '');
			const full =
				value.length === 3
					? value
							.split('')
							.map((c) => c + c)
							.join('')
					: value;
			const int = Number.parseInt(full, 16);
			return {
				r: (int >> 16) & 255,
				g: (int >> 8) & 255,
				b: int & 255
			};
		}

		const chartPalette = ['#F07178', '#6C5CE7', '#FFB454'];

		let activeColor = chartPalette[0];
		let activeColorRgb = hexToRgb(activeColor);

		function setActiveColor(color) {
			activeColor = color;
			activeColorRgb = hexToRgb(color);
		}

		function colorWithAlpha(shade = 255) {
			const alpha = Math.max(0, Math.min(1, shade / 255));
			return `rgba(${activeColorRgb.r}, ${activeColorRgb.g}, ${activeColorRgb.b}, ${alpha})`;
		}

		// ============================================
		// GRID
		// ============================================

		function drawGrid() {
			const t = theme();

			ctx.fillStyle = t.bg;

			ctx.fillRect(0, 0, width, height);

			ctx.strokeStyle = t.grid;

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}

		// ============================================
		// CELL
		// ============================================

		function drawCell(col, row, shade = 255) {
			if (col < PAD || col >= cols - PAD || row < PAD || row >= rows - PAD) return;

			ctx.fillStyle = colorWithAlpha(shade);

			ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);
		}

		function heatmap() {
			for (let y = 4; y < rows - 4; y++) {
				for (let x = 4; x < cols - 4; x++) {
					const v = (Math.sin(x * 0.08) + Math.cos(y * 0.06) + Math.sin((x + y) * 0.04)) / 3;

					const shade = Math.floor(((v + 1) / 2) * 255);

					drawCell(x, y, shade);
				}
			}
		}

		// ============================================
		// CHART REGISTRY
		// ============================================

		const charts = [
			{
				name: 'HEATMAP',
				fn: heatmap
			}
		];

		// ============================================
		// ANIMATION
		// ============================================

		let current = 0;

		function render() {
			if (!ctx || cols === 0 || rows === 0) return;

			drawGrid();

			const chart = charts[current];
			setActiveColor(chartPalette[current % chartPalette.length]);

			chart.fn();

			current = (current + 1) % charts.length;
		}

		setSize();
		render();

		const interval = setInterval(render, 2000);
		const resizeObserver = new ResizeObserver(() => {
			setSize();
			render();
		});
		resizeObserver.observe(container);
		const unsubscribe = darkTheme.subscribe((value) => {
			isDark = value;
			render();
		});

		return () => {
			clearInterval(interval);
			resizeObserver.disconnect();
			unsubscribe();
		};
	});
</script>

<div class="hero-canvas" bind:this={container}>
	{#if videoSrc}
		<video class="hero-video" src={videoSrc} autoplay muted loop playsinline></video>
	{/if}
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
	.hero-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.4;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
