import { describe, it, expect } from 'vitest';
import { getStaticSeo, SITE_URL } from './seo.js';

describe('getStaticSeo', () => {
	it('returns complete metadata for every page key', () => {
		for (const key of ['home', 'about', 'gallery']) {
			const seo = getStaticSeo(key);
			expect(seo.title, key).toBeTruthy();
			expect(seo.description, key).toBeTruthy();
			expect(seo.url.startsWith(`${SITE_URL}/`), key).toBe(true);
			expect(seo.image.startsWith(SITE_URL), key).toBe(true);
			expect(seo.jsonLd.length, key).toBeGreaterThanOrEqual(1);
		}
	});

	it('home JSON-LD leads with Organization, then WebSite', () => {
		const { jsonLd } = getStaticSeo('home');
		expect(jsonLd[0]['@type']).toBe('Organization');
		expect(jsonLd[1]['@type']).toBe('WebSite');
	});

	it('page JSON-LD mirrors schema type and canonical url', () => {
		const expectedType = { about: 'AboutPage', gallery: 'ImageGallery' };
		for (const [key, type] of Object.entries(expectedType)) {
			const seo = getStaticSeo(key);
			const pageLd = seo.jsonLd.at(-1);
			expect(pageLd['@type']).toBe(type);
			expect(pageLd.url).toBe(seo.url);
		}
	});

	it('throws on unknown page key', () => {
		expect(() => getStaticSeo('blog')).toThrow('unknown page key "blog"');
	});
});
