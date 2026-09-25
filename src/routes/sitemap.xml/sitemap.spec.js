import { describe, it, expect } from 'vitest';
import { GET } from './+server.js';

const getXml = async () => {
	const res = await GET();
	expect(res.headers.get('Content-Type')).toBe('application/xml');
	return res.text();
};

describe('sitemap.xml', () => {
	it('lists exactly the live pages as absolute URLs', async () => {
		const xml = await getXml();
		expect(xml).toContain('<?xml version="1.0"');
		const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		expect(locs).toEqual([
			'https://byte-charts.dev/',
			'https://byte-charts.dev/about',
			'https://byte-charts.dev/gallery'
		]);
	});

	it('does not reference removed routes', async () => {
		const xml = await getXml();
		expect(xml).not.toMatch(/\/(blog|contact)/);
	});
});
