import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Incremental thumbnail generator.
//
// - Only (re)generates outputs for sources that are new or changed (sha256 of
//   file contents, tracked in .manifest.json). Unchanged images are skipped,
//   so this is cheap to run and is NOT part of `npm run build`.
// - Run it manually after adding/changing gallery sources, then commit the
//   resulting thumbs/ + gallery.json:
//       npm run generate-thumbnails
// - Flags:
//       --force   regenerate everything
//       --check   exit 1 if anything is stale, without writing (for CI)
//
// Manual metadata: each gallery.json entry may carry hand-edited fields
// (title, subtitle, year, tags, link/url, interactive). They are preserved
// across regens:
//   { "file": "static__5.png", ..., "title": "...", "subtitle": "...",
//     "year": "2026", "tags": ["dataviz"],
//     "interactive": "True", "url": "https://..." }
// Entries with a `url` (or `link`) open the URL in a new tab instead of the
// lightbox and appear in the "Interactive" gallery filter.

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const CHECK = args.has('--check');

const THUMB_WIDTH = 600;

const sourceDir = path.resolve('static/images/charts/gallery/static');
const outputDir = path.resolve('static/images/charts/gallery/thumbs');
const galleryJsonPath = path.resolve('static/images/charts/gallery/gallery.json');
const manifestPath = path.join(outputDir, '.manifest.json');

const fail = (message) => {
	console.error(`generate-thumbnails: ${message}`);
	process.exit(1);
};

let entries;
try {
	entries = await fs.readdir(sourceDir);
} catch (error) {
	if (error?.code === 'ENOENT') {
		fail(`source directory not found: ${sourceDir}\nAdd gallery images there and re-run.`);
	}
	throw error;
}

const sources = entries.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
const skipped = entries.filter((file) => !/\.(png|jpe?g|webp)$/i.test(file));
if (skipped.length > 0) {
	console.log(`Skipping ${skipped.length} unsupported file(s): ${skipped.join(', ')}`);
}

// One stem (basename without extension) maps to one .webp + one .avif.
// Two sources sharing a stem (e.g. foo.png + foo.webp) would silently
// overwrite each other, so refuse instead.
const stems = new Map();
for (const file of sources) {
	const stem = file.replace(/\.[^.]+$/, '');
	const clash = stems.get(stem);
	if (clash && clash !== file) {
		fail(
			`filename collision: "${clash}" and "${file}" would both generate "${stem}.webp".\nRename one of them so every source has a unique basename.`
		);
	}
	stems.set(stem, file);
}

await fs.mkdir(outputDir, { recursive: true });

let manifest = {};
try {
	manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
} catch (error) {
	if (error?.code !== 'ENOENT') throw error;
}

// Hand-edited per-image fields survive regeneration. Keyed by source file.
let previousMeta = new Map();
try {
	const previous = JSON.parse(await fs.readFile(galleryJsonPath, 'utf8'));
	if (Array.isArray(previous)) {
		previousMeta = new Map(previous.map((entry) => [entry?.file, entry]));
	}
} catch (error) {
	if (error?.code !== 'ENOENT') throw error;
}

const MANUAL_FIELDS = ['title', 'subtitle', 'year', 'tags', 'link', 'url', 'interactive'];

const preservedFields = (file) => {
	const entry = previousMeta.get(file);
	if (!entry) return {};
	return Object.fromEntries(
		MANUAL_FIELDS.filter((key) => entry[key] !== undefined).map((key) => [key, entry[key]])
	);
};

const hashFile = async (filePath) => {
	const hash = createHash('sha256');
	hash.update(await fs.readFile(filePath));
	return hash.digest('hex');
};

const metadata = [];
const failures = [];
let generated = 0;
let reused = 0;

for (const file of [...sources].sort()) {
	const input = path.join(sourceDir, file);
	const stem = file.replace(/\.[^.]+$/, '');
	const webpOutput = path.join(outputDir, `${stem}.webp`);
	const avifOutput = path.join(outputDir, `${stem}.avif`);

	try {
		const hash = await hashFile(input);
		const cached = manifest[file];

		const info = await sharp(input).metadata();
		if (!info.width || !info.height) throw new Error('unreadable image dimensions');

		const upToDate =
			!FORCE &&
			cached?.hash === hash &&
			cached?.thumbWidth &&
			cached?.thumbHeight &&
			(await fs.stat(webpOutput).then(
				() => true,
				() => false
			)) &&
			(await fs.stat(avifOutput).then(
				() => true,
				() => false
			));

		if (upToDate) {
			reused += 1;
			metadata.push({
				file,
				width: info.width,
				height: info.height,
				thumbWidth: cached.thumbWidth,
				thumbHeight: cached.thumbHeight,
				...preservedFields(file)
			});
			continue;
		}

		if (CHECK) {
			failures.push(file);
			continue;
		}

		const webpInfo = await sharp(input)
			.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
			.webp({ quality: 70 })
			.toFile(webpOutput);

		const avifInfo = await sharp(input)
			.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
			.avif({ quality: 55, effort: 4 })
			.toFile(avifOutput);

		manifest[file] = { hash, thumbWidth: webpInfo.width, thumbHeight: webpInfo.height };
		metadata.push({
			file,
			width: info.width,
			height: info.height,
			thumbWidth: webpInfo.width,
			thumbHeight: avifInfo.height,
			...preservedFields(file)
		});
		generated += 1;
		console.log(`Generated ${stem}.webp + ${stem}.avif`);
	} catch (error) {
		failures.push(file);
		console.error(`Failed ${file}: ${error?.message ?? error}`);
	}
}

if (CHECK) {
	if (failures.length > 0) {
		fail(
			`${failures.length} thumbnail(s) stale or missing: ${failures.join(', ')}.\nRun "npm run generate-thumbnails" and commit the result.`
		);
	}
	console.log(`Thumbnails up to date (${sources.length} source(s)).`);
	process.exit(0);
}

if (failures.length > 0) {
	fail(`${failures.length} file(s) failed, nothing was written. Fix the files above and re-run.`);
}

// Prune orphans: thumbs whose source was deleted, and stale manifest keys.
const liveStems = new Set([...stems.keys()]);
const outputs = await fs.readdir(outputDir);
for (const file of outputs) {
	if (file === '.manifest.json') continue;
	const match = file.match(/^(.*)\.(webp|avif)$/i);
	if (!match || !liveStems.has(match[1])) {
		await fs.rm(path.join(outputDir, file));
		console.log(`Removed orphan ${file}`);
	}
}
for (const key of Object.keys(manifest)) {
	if (!sources.includes(key)) delete manifest[key];
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
await fs.writeFile(galleryJsonPath, JSON.stringify(metadata, null, 2));

console.log(`Done: ${generated} generated, ${reused} reused, ${sources.length} total.`);
