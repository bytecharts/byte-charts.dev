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

	onMount(() => {
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

		// THEMES
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

		function colorWithAlpha(shade = 255) {
			const alpha = Math.max(0, Math.min(1, shade / 255));
			return `rgba(${activeColorRgb.r}, ${activeColorRgb.g}, ${activeColorRgb.b}, ${alpha})`;
		}

		// GRID
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

		// CELL
		function drawCell(col, row, shade = 255) {
			if (col < PAD || col >= cols - PAD || row < PAD || row >= rows - PAD) return;

			ctx.fillStyle = colorWithAlpha(shade);

			ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);
		}

		function render() {
			if (!ctx || cols === 0 || rows === 0) return;

			drawGrid();
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

<div class="bg-canvas" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.bg-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
