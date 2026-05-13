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
		// ============================================
		// CONFIG
		// ============================================

		const cellSize = 5;
		const PAD = 2;

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
				grid: '#ccc',

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

			ctx.fillStyle = theme().shades(shade);

			ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);
		}

		// ============================================
		// HELPERS
		// ============================================

		function rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function drawLine(x1, y1, x2, y2, shade = 255) {
			const dx = x2 - x1;
			const dy = y2 - y1;

			const steps = Math.max(Math.abs(dx), Math.abs(dy));

			for (let i = 0; i <= steps; i++) {
				const x = Math.floor(x1 + (dx * i) / steps);

				const y = Math.floor(y1 + (dy * i) / steps);

				drawCell(x, y, shade);
			}
		}

		function drawCircle(cx, cy, r, shade = 255) {
			for (let y = -r; y <= r; y++) {
				for (let x = -r; x <= r; x++) {
					if (x * x + y * y <= r * r) {
						drawCell(cx + x, cy + y, shade);
					}
				}
			}
		}

		// ============================================
		// CHARTS
		// ============================================

		function treemap() {
			recursiveTreemap(4, 4, cols - 8, rows - 8, 0);
		}

		function recursiveTreemap(x, y, w, h, d) {
			if (w < 6 || h < 6 || d > 4) {
				const shade = rand(60, 255);

				for (let yy = y; yy < y + h; yy++) {
					for (let xx = x; xx < x + w; xx++) {
						drawCell(xx, yy, shade);
					}
				}

				return;
			}

			if (Math.random() > 0.5) {
				const cut = rand(4, w - 4);

				recursiveTreemap(x, y, cut, h, d + 1);

				recursiveTreemap(x + cut, y, w - cut, h, d + 1);
			} else {
				const cut = rand(4, h - 4);

				recursiveTreemap(x, y, w, cut, d + 1);

				recursiveTreemap(x, y + cut, w, h - cut, d + 1);
			}
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

		function lineChart() {
			const lines = 5;

			for (let l = 0; l < lines; l++) {
				let prev = null;

				for (let x = 4; x < cols - 4; x++) {
					const y = Math.floor(
						rows / 2 + Math.sin(x * 0.06 + l) * (8 + l * 3) + Math.cos(x * 0.02 + l) * 10
					);

					drawCell(x, y, 255 - l * 40);

					if (prev) {
						drawLine(prev.x, prev.y, x, y, 255 - l * 40);
					}

					prev = { x, y };
				}
			}
		}

		function histogram() {
			const bins = 24;

			const spacing = Math.floor((cols - 10) / bins);

			const base = rows - 8;

			for (let i = 0; i < bins; i++) {
				const h = rand(10, 70);

				for (let x = 5 + i * spacing; x < 5 + i * spacing + spacing - 1; x++) {
					for (let y = base; y > base - h; y--) {
						drawCell(x, y, 120 + h);
					}
				}
			}
		}

		function scatterplot() {
			for (let i = 0; i < 3000; i++) {
				const x = rand(4, cols - 4);

				const y = Math.floor(rows / 2 + (Math.random() - 0.5) * (Math.random() - 0.5) * 100);

				drawCell(x, y, rand(80, 255));
			}
		}

		function ridgeline() {
			for (let l = 0; l < 10; l++) {
				const offset = 12 + l * 12;

				for (let x = 4; x < cols - 4; x++) {
					const y = Math.floor(offset + Math.sin(x * 0.05 + l) * 5);

					for (let yy = offset + 6; yy >= y; yy--) {
						drawCell(x, yy, 60 + l * 18);
					}
				}
			}
		}

		function contour() {
			for (let y = 4; y < rows - 4; y++) {
				for (let x = 4; x < cols - 4; x++) {
					const v = Math.sin(x * 0.08) + Math.cos(y * 0.08);

					const band = Math.floor(v * 4);

					if (band % 2 === 0) {
						drawCell(x, y, 180 - band * 10);
					}
				}
			}
		}

		function network() {
			const nodes = [];

			for (let i = 0; i < 80; i++) {
				nodes.push({
					x: rand(6, cols - 6),
					y: rand(6, rows - 6)
				});
			}

			for (let i = 0; i < 150; i++) {
				const a = nodes[rand(0, nodes.length - 1)];

				const b = nodes[rand(0, nodes.length - 1)];

				drawLine(a.x, a.y, b.x, b.y, 100);
			}

			nodes.forEach((n) => {
				drawCircle(n.x, n.y, 1, 255);
			});
		}

		function streamgraph() {
			const mid = Math.floor(rows / 2);

			for (let x = 4; x < cols - 4; x++) {
				let offsetTop = 0;
				let offsetBottom = 0;

				for (let l = 0; l < 5; l++) {
					const h = Math.floor(Math.sin(x * 0.03 + l * 0.8) * 6 + 10);

					// upper stream
					for (let y = mid - offsetTop; y > mid - offsetTop - h; y--) {
						drawCell(x, y, 70 + l * 35);
					}

					// lower stream
					for (let y = mid + offsetBottom; y < mid + offsetBottom + h; y++) {
						drawCell(x, y, 70 + l * 35);
					}

					offsetTop += h;
					offsetBottom += h;
				}
			}
		}
		function bubbleChart() {
			for (let i = 0; i < 40; i++) {
				drawCircle(rand(8, cols - 8), rand(8, rows - 8), rand(2, 10), rand(100, 255));
			}
		}

		function dendrogram() {
			branch(Math.floor(cols / 2), 6, 30);
		}

		function branch(x, y, len) {
			if (len < 3) return;

			const lx = x - len;
			const rx = x + len;

			const ny = y + 10;

			drawLine(x, y, lx, ny, 180);
			drawLine(x, y, rx, ny, 180);

			branch(lx, ny, len * 0.6);
			branch(rx, ny, len * 0.6);
		}

		// ============================================
		// CHART REGISTRY
		// ============================================

		const charts = [
			{
				name: 'TREEMAP',
				fn: treemap
			},

			{
				name: 'HEATMAP',
				fn: heatmap
			},

			{
				name: 'LINE CHART',
				fn: lineChart
			},

			{
				name: 'HISTOGRAM',
				fn: histogram
			},

			{
				name: 'SCATTERPLOT',
				fn: scatterplot
			},

			{
				name: 'RIDGELINE',
				fn: ridgeline
			},

			{
				name: 'CONTOUR',
				fn: contour
			},

			{
				name: 'NETWORK',
				fn: network
			},

			{
				name: 'STREAMGRAPH',
				fn: streamgraph
			},

			{
				name: 'BUBBLE',
				fn: bubbleChart
			},

			{
				name: 'DENDROGRAM',
				fn: dendrogram
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
		width: 100%;
		height: 100%;
	}
</style>
