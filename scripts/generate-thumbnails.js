import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const sourceDir = path.resolve('static/images/charts/gallery/static');
const outputDir = path.resolve('static/images/charts/gallery/thumbs');

await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(sourceDir);

const metadata = [];

for (const file of files) {
	if (!/\.(png|webp|jpe?g)$/i.test(file)) continue;

	const input = path.join(sourceDir, file);

	const image = sharp(input);

	const info = await image.metadata();

	metadata.push({
		file,
		width: info.width,
		height: info.height
	});

	const webpOutput = path.join(outputDir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
	const avifOutput = path.join(outputDir, file.replace(/\.[^.]+$/, '.avif'));

	await image
		.resize({
			width: 600,
			withoutEnlargement: true
		})
		.webp({ quality: 70 })
		.toFile(webpOutput);

	await sharp(input)
		.resize({
			width: 600,
			withoutEnlargement: true
		})
		.avif({ quality: 55, effort: 4 })
		.toFile(avifOutput);
}

await fs.writeFile(
	path.resolve('static/images/charts/gallery/gallery.json'),
	JSON.stringify(metadata, null, 2)
);
