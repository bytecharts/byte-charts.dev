import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const gallery = readJson('static/images/charts/gallery/gallery.json');
const videos = readJson('static/videos/videos.json');

const galleryStaticDir = 'static/images/charts/gallery/static';
const galleryThumbDir = 'static/images/charts/gallery/thumbs';
const thumbBase = (file) => file.replace(/\.(png|jpe?g|webp)$/i, '');

describe('gallery.json ↔ files on disk', () => {
	it('every entry has dimensions', () => {
		expect(gallery.length).toBeGreaterThan(0);
		for (const entry of gallery) {
			expect(entry.file, entry.file).toBeTruthy();
			expect(entry.width, entry.file).toBeGreaterThan(0);
			expect(entry.height, entry.file).toBeGreaterThan(0);
			expect(entry.thumbWidth, entry.file).toBeGreaterThan(0);
			expect(entry.thumbHeight, entry.file).toBeGreaterThan(0);
		}
	});

	it('every source image exists', () => {
		for (const entry of gallery) {
			expect(existsSync(join(root, galleryStaticDir, entry.file)), entry.file).toBe(true);
		}
	});

	it('every webp + avif thumbnail exists', () => {
		for (const entry of gallery) {
			const base = thumbBase(entry.file);
			expect(existsSync(join(root, galleryThumbDir, `${base}.webp`)), base).toBe(true);
			expect(existsSync(join(root, galleryThumbDir, `${base}.avif`)), base).toBe(true);
		}
	});
});

describe('videos.json ↔ files on disk', () => {
	it('every entry has dimensions', () => {
		expect(videos.length).toBeGreaterThan(0);
		for (const video of videos) {
			expect(video.src, video.src).toBeTruthy();
			expect(video.poster, video.src).toBeTruthy();
			expect(video.width, video.src).toBeGreaterThan(0);
			expect(video.height, video.src).toBeGreaterThan(0);
		}
	});

	it('every video and poster file exists under static/', () => {
		for (const video of videos) {
			expect(existsSync(join(root, 'static', video.src)), video.src).toBe(true);
			expect(existsSync(join(root, 'static', video.poster)), video.poster).toBe(true);
		}
	});
});
