import { chromium } from 'playwright';

const browser = await chromium.launch({
	executablePath: '/home/quark/.nix-profile/bin/google-chrome',
	args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto('http://localhost:8789/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500); // wait past reveal phases so video plays full-quality

const result = await page.evaluate(async () => {
	const canvas = document.querySelector('.hero-canvas canvas');
	const dpr = window.devicePixelRatio;

	// Find the hero video: detached element with Climate_Stripes src.
	// It's created in JS, not in DOM — can't query it. Instead measure via rAF sampling
	// of canvas pixels + rAF timing. Also probe any video in DOM.
	const videos = Array.from(document.querySelectorAll('video'));

	// rAF cadence over 4s
	const deltas = [];
	let last = performance.now();
	const stopAt = last + 4000;
	await new Promise((resolve) => {
		function tick(t) {
			deltas.push(t - last);
			last = t;
			if (t < stopAt) requestAnimationFrame(tick);
			else resolve();
		}
		requestAnimationFrame(tick);
	});

	// canvas pixel-change cadence: count how many rAF ticks produce a changed canvas
	// (sample a small region via drawImage into probe canvas)
	const probe = document.createElement('canvas');
	probe.width = 64;
	probe.height = 64;
	const pctx = probe.getContext('2d', { willReadFrequently: true });
	let canvasChanges = 0;
	let canvasSamples = 0;
	let prevData = null;
	const changeStop = performance.now() + 4000;
	await new Promise((resolve) => {
		function sample() {
			pctx.drawImage(canvas, 0, 0, 64, 64);
			const d = pctx.getImageData(0, 0, 64, 64).data;
			canvasSamples++;
			if (prevData) {
				let diff = 0;
				for (let i = 0; i < d.length; i += 40) diff += Math.abs(d[i] - prevData[i]);
				if (diff > 0) canvasChanges++;
			}
			prevData = d;
			if (performance.now() < changeStop) requestAnimationFrame(sample);
			else resolve();
		}
		requestAnimationFrame(sample);
	});

	// measure cost of two fullscreen filtered drawImage ops (mimics Hero paint)
	const cost = (() => {
		if (!canvas) return null;
		const c2 = document.createElement('canvas');
		c2.width = canvas.width;
		c2.height = canvas.height;
		const x = c2.getContext('2d');
		const t0 = performance.now();
		const N = 30;
		for (let i = 0; i < N; i++) {
			x.clearRect(0, 0, c2.width, c2.height);
			x.filter = 'grayscale(1) blur(1px)';
			x.drawImage(canvas, 0, 0);
			x.filter = 'blur(1px)';
			x.drawImage(canvas, 0, 0);
			x.filter = 'none';
		}
		// force flush
		x.getImageData(0, 0, 1, 1);
		return (performance.now() - t0) / N;
	})();

	// cost without filters, for comparison
	const costNoFilter = (() => {
		if (!canvas) return null;
		const c2 = document.createElement('canvas');
		c2.width = canvas.width;
		c2.height = canvas.height;
		const x = c2.getContext('2d');
		const t0 = performance.now();
		const N = 30;
		for (let i = 0; i < N; i++) {
			x.clearRect(0, 0, c2.width, c2.height);
			x.drawImage(canvas, 0, 0);
			x.drawImage(canvas, 0, 0);
		}
		x.getImageData(0, 0, 1, 1);
		return (performance.now() - t0) / N;
	})();

	const stats = (arr) => {
		const s = [...arr].sort((a, b) => a - b);
		return {
			n: s.length,
			mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2),
			p50: +s[Math.floor(s.length * 0.5)].toFixed(2),
			p95: +s[Math.floor(s.length * 0.95)].toFixed(2),
			max: +s[s.length - 1].toFixed(2),
			fps: +(1000 / (s.reduce((a, b) => a + b, 0) / s.length)).toFixed(1)
		};
	};

	return {
		dpr,
		canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
		canvasCss: canvas ? canvas.getBoundingClientRect() : null,
		domVideos: videos.map((v) => ({
			src: v.currentSrc.split('/').pop(),
			paused: v.paused,
			currentTime: +v.currentTime.toFixed(2),
			readyState: v.readyState
		})),
		rafTiming: stats(deltas),
		canvasChangedPct: +((100 * canvasChanges) / Math.max(1, canvasSamples - 1)).toFixed(1),
		canvasSamples,
		msPerFilteredPaint: +cost.toFixed(2),
		msPerPlainPaint: +costNoFilter.toFixed(2)
	};
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
