<script>
	import { onMount } from 'svelte';
	import { darkTheme } from '$lib/stores/theme.js';

	let isDark = false;
	let canvas;
	let container;
	let ctx;
	let width = 0;
	let height = 0;

	onMount(() => {
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
		}

		// -------------------------
		// THEMES
		// -------------------------
		const themes = {
			dark: {
				bg: '#000',
				gridRgb: { r: 255, g: 255, b: 255 } // lines fade IN from black bg
			},
			light: {
				bg: '#fff',
				gridRgb: { r: 30, g: 30, b: 30 } // lines fade IN (darker) from white bg
			}
		};

		function theme() {
			return isDark ? themes.dark : themes.light;
		}

		function colorWithAlpha(rgb, alpha) {
			return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, alpha))})`;
		}

		// -------------------------
		// TUNNEL CONFIG
		// -------------------------
		const spacing = 30; // spacing of lines within a single XY plane

		const layers = 40; // number of planes in the tunnel
		const scaleMax = 0.4; // apparent scale of the nearest plane
		const scaleMin = 0.000002; // apparent scale of the farthest plane before it's invisible
		const fadeStartScale = 0.65; // planes below this scale start fading out
		const speed = 0.0000055; // scroll speed (loops per ms)

		let animationFrame;

		function project(x, y, scale) {
			return {
				x: width / 2 + x * scale,
				y: height / 2 + y * scale
			};
		}

		// Geometric (log) interpolation between scaleMax and scaleMin.
		// This is what keeps the planes feeling evenly spaced instead of
		// bunching up near the vanishing point: perspective scale falls off
		// as 1/depth, so stepping scale geometrically undoes that curve.
		function scaleForParam(p) {
			return scaleMax * Math.pow(scaleMin / scaleMax, p);
		}
		function drawPlane(scale, rgb, halfW, halfH) {
			// Fade out (and thin out) as the plane shrinks toward the vanishing point
			const alpha = Math.min(1, scale / fadeStartScale);

			if (alpha <= 0.015) return; // skip near-invisible planes entirely, don't let them pile up

			ctx.strokeStyle = colorWithAlpha(rgb, alpha);
			ctx.lineWidth = 0.3;

			// Horizontal lines
			for (let y = -halfH; y <= halfH; y += spacing) {
				const a = project(-halfW, y, scale);
				const b = project(halfW, y, scale);
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}

			// Vertical lines
			for (let x = -halfW; x <= halfW; x += spacing) {
				const a = project(x, -halfH, scale);
				const b = project(x, halfH, scale);
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}
		}

		function drawPlane2(scale, rgb) {
			// Fade out (and thin out) as the plane shrinks toward the vanishing point
			const alpha = Math.min(1, scale / fadeStartScale);
			if (alpha <= 0.015) return; // skip near-invisible planes entirely, don't let them pile up

			ctx.strokeStyle = colorWithAlpha(rgb, alpha);
			ctx.lineWidth = Math.max(0.5, 1.5 * scale);

			// World-space extent so this plane's projection always fills the viewport
			const halfW = width / 2 / scale;
			const halfH = height / 2 / scale;

			// Scale line spacing by the same factor as the extent. Without this,
			// far planes (small scale) get a huge extent but the same fine spacing,
			// so the number of lines drawn explodes as scale shrinks. Scaling
			// spacing too keeps line COUNT roughly constant across all planes,
			// which is also what real perspective grids look like: distant grid
			// cells cover more world-space per cell.
			const planeSpacing = spacing / scale;

			// Horizontal lines
			for (let y = -halfH; y <= halfH; y += planeSpacing) {
				const a = project(-halfW, y, scale);
				const b = project(halfW, y, scale);
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}

			// Vertical lines
			for (let x = -halfW; x <= halfW; x += planeSpacing) {
				const a = project(x, -halfH, scale);
				const b = project(x, halfH, scale);
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}
		}

		function drawGrid(time = 0) {
			const t = theme();

			ctx.fillStyle = t.bg;
			ctx.fillRect(0, 0, width, height);

			// Use viewport size for the plane extent, so lines always
			// reach the edges of the canvas regardless of window size.
			// Divide by scaleMax so the NEAREST plane exactly fills the
			// viewport; farther (smaller-scale) planes project larger
			// world-space extents onto the same screen area automatically.
			const halfW = width / 2 / scaleMax;
			const halfH = height / 2 / scaleMax;

			const loopT = (time * speed) % 1;

			// Draw far -> near so nearer (larger, more opaque) planes render on
			// top of farther ones, instead of the compressed far planes
			// overdrawing everything near the vanishing point.
			for (let i = layers - 1; i >= 0; i--) {
				const p = (i / layers + loopT) % 1;
				const scale = scaleForParam(p);
				drawPlane(scale * 1.3, t.gridRgb, halfW, halfH);
			}
		}

		function animate(time) {
			drawGrid(time);
			animationFrame = requestAnimationFrame(animate);
		}

		function render() {
			if (!ctx || width === 0 || height === 0) return;
			drawGrid();
		}

		setSize();
		render();
		animate(0);

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
			cancelAnimationFrame(animationFrame);
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
