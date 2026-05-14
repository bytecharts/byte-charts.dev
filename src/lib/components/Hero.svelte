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

		function circularBarplot() {
			const cx = Math.floor(cols / 2);

			const cy = Math.floor(rows / 2);

			const bars = 64;

			const innerRadius = 36;

			for (let i = 0; i < bars; i++) {
				const angle = ((Math.PI * 2) / bars) * i;

				const length = rand(10, 60);

				const shade = 80 + Math.floor((length / 28) * 175);

				for (let r = innerRadius; r < innerRadius + length; r++) {
					const x = Math.floor(cx + Math.cos(angle) * r);

					const y = Math.floor(cy + Math.sin(angle) * r);

					drawCell(x, y, shade);

					// thicken bars
					const x2 = Math.floor(cx + Math.cos(angle + 0.01) * r);

					const y2 = Math.floor(cy + Math.sin(angle + 0.01) * r);

					drawCell(x2, y2, shade);
				}
			}

			// center circle
			drawCircle(cx, cy, innerRadius - 2, 220);
		}

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
				name: 'Circular Barplot',
				fn: circularBarplot
			},
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
			}
		];
		// ============================================
		// TRIANGLE GRID
		// ============================================

		function triangleGrid() {
			const size = 6;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					const flip = (Math.floor(x / size) + Math.floor(y / size)) % 2;

					drawTriangle(x, y, size, flip, 220);
				}
			}
		}

		// ============================================
		// TRIANGLE WAVES
		// ============================================

		function triangleWaves() {
			const size = 8;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					const v = Math.sin(x * 0.08 + y * 0.04);

					const shade = Math.floor(((v + 1) / 2) * 255);

					drawTriangle(x, y, size, v > 0, shade);
				}
			}
		}

		// ============================================
		// TRIANGLE SPIRAL
		// ============================================

		function triangleSpiral() {
			const cx = cols / 2;

			const cy = rows / 2;

			const size = 6;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					const angle = Math.atan2(y - cy, x - cx);

					const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

					const v = Math.sin(d * 0.2 + angle * 4);

					drawTriangle(x, y, size, v > 0, 200);
				}
			}
		}

		// ============================================
		// TRIANGLE TERRAIN
		// ============================================

		function triangleTerrain() {
			const size = 6;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					const v = Math.sin(x * 0.06) + Math.cos(y * 0.06);

					const shade = Math.floor(((v + 2) / 4) * 255);

					drawTriangle(x, y, size, v > 0, shade);
				}
			}
		}

		// ============================================
		// TRIANGLE MOSAIC
		// ============================================

		function triangleMosaic() {
			const size = 5;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					drawTriangle(x, y, size, Math.random() > 0.5, rand(80, 255));
				}
			}
		}

		// ============================================
		// TRIANGLE OPTICAL
		// ============================================

		function triangleOptical() {
			const cx = cols / 2;

			const cy = rows / 2;

			const size = 6;

			for (let y = 0; y < rows; y += size) {
				for (let x = 0; x < cols; x += size) {
					const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

					const flip = Math.floor(d / 4) % 2;

					drawTriangle(x, y, size, flip, 255);
				}
			}
		}

		// ============================================
		// TRIANGLE HELPER
		// ============================================

		function drawTriangle(x, y, size, flip, shade = 255) {
			for (let yy = 0; yy < size; yy++) {
				const width = Math.floor((yy / size) * size);

				for (let xx = 0; xx <= width; xx++) {
					if (flip) {
						drawCell(x + xx, y + yy, shade);
					} else {
						drawCell(x + size - xx, y + yy, shade);
					}
				}
			}
		}

		// ============================================
		// REGISTER
		// ============================================

		charts.push({
			name: 'TRI GRID',

			fn: triangleGrid
		});

		charts.push({
			name: 'TRI WAVES',

			fn: triangleWaves
		});

		charts.push({
			name: 'TRI SPIRAL',

			fn: triangleSpiral
		});

		charts.push({
			name: 'TRI TERRAIN',

			fn: triangleTerrain
		});

		charts.push({
			name: 'TRI MOSAIC',

			fn: triangleMosaic
		});

		charts.push({
			name: 'TRI OPTICAL',

			fn: triangleOptical
		});
		// ============================================
		// ZEBRA STRIPES
		// ============================================

		function zebraPattern() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const wave = Math.sin(x * 0.12 + y * 0.04);

					if (wave > 0) {
						drawCell(x, y, 255);
					}
				}
			}
		}

		// ============================================
		// TOPOGRAPHIC WAVES
		// ============================================

		function topoPattern() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const v = Math.sin(x * 0.08) + Math.cos(y * 0.08) + Math.sin((x + y) * 0.03);

					const band = Math.floor(v * 4);

					if (band % 2 === 0) {
						drawCell(x, y, 180);
					}
				}
			}
		}

		// ============================================
		// MOIRÉ INTERFERENCE
		// ============================================

		function moirePattern() {
			const cx = cols / 2;

			const cy = rows / 2;

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const d1 = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

					const d2 = Math.sqrt((x - cx * 0.7) ** 2 + (y - cy * 1.2) ** 2);

					const v = Math.sin(d1 * 0.6) + Math.sin(d2 * 0.6);

					if (v > 0) {
						drawCell(x, y, 220);
					}
				}
			}
		}

		// ============================================
		// CHECKER DISTORTION
		// ============================================

		function warpedChecker() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const xx = x + Math.sin(y * 0.08) * 6;

					const yy = y + Math.cos(x * 0.08) * 6;

					const v = (Math.floor(xx / 6) + Math.floor(yy / 6)) % 2;

					if (v === 0) {
						drawCell(x, y, 255);
					}
				}
			}
		}

		// ============================================
		// FLOW FIELD
		// ============================================

		function flowField() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const angle = Math.sin(x * 0.03) * Math.cos(y * 0.03) * Math.PI * 4;

					const v = Math.sin(angle * 4);

					if (v > 0.2) {
						drawCell(x, y, 200);
					}
				}
			}
		}

		// ============================================
		// CONCENTRIC WAVES
		// ============================================

		function concentricPattern() {
			const cx = cols / 2;

			const cy = rows / 2;

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

					const v = Math.sin(d * 0.8);

					if (v > 0) {
						drawCell(x, y, 255);
					}
				}
			}
		}

		// ============================================
		// DIAGONAL WEAVE
		// ============================================

		function weavePattern() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const a = Math.sin((x + y) * 0.08);

					const b = Math.cos((x - y) * 0.08);

					if (a * b > 0) {
						drawCell(x, y, 220);
					}
				}
			}
		}

		// ============================================
		// NOISE CLOUD
		// ============================================

		function noiseCloud() {
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const v = Math.sin(x * 0.05) * Math.cos(y * 0.05) + Math.sin((x + y) * 0.02);

					const shade = Math.floor(((v + 1) / 2) * 255);

					drawCell(x, y, shade);
				}
			}
		}

		// ============================================
		// REGISTER
		// ============================================

		charts.push({
			name: 'ZEBRA',

			fn: zebraPattern
		});

		charts.push({
			name: 'TOPO',

			fn: topoPattern
		});

		charts.push({
			name: 'MOIRE',

			fn: moirePattern
		});

		charts.push({
			name: 'CHECKER',

			fn: warpedChecker
		});

		charts.push({
			name: 'FLOW FIELD',

			fn: flowField
		});

		charts.push({
			name: 'CONCENTRIC',

			fn: concentricPattern
		});

		charts.push({
			name: 'WEAVE',

			fn: weavePattern
		});

		charts.push({
			name: 'NOISE',

			fn: noiseCloud
		});

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
