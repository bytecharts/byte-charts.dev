import { loadPosts } from '$lib/blog';

const BASE_URL = 'https://byte-charts.dev';

const staticPages = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/about', changefreq: 'monthly', priority: '0.8' },
	{ path: '/gallery', changefreq: 'weekly', priority: '0.9' },
	{ path: '/contact', changefreq: 'monthly', priority: '0.5' },
	{ path: '/blog', changefreq: 'weekly', priority: '0.9' }
];

export const prerender = true;

export async function GET() {
	const posts = await loadPosts();

	const postEntries = posts.map((post) => {
		const lastmod = post.meta?.date ? new Date(post.meta.date).toISOString() : new Date().toISOString();
		return `\t<url>\n\t\t<loc>${BASE_URL}/blog/${post.slug}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<changefreq>monthly</changefreq>\n\t\t<priority>0.7</priority>\n\t</url>`;
	});

	const staticEntries = staticPages.map(
		(page) => `\t<url>\n\t\t<loc>${BASE_URL}${page.path}</loc>\n\t\t<changefreq>${page.changefreq}</changefreq>\n\t\t<priority>${page.priority}</priority>\n\t</url>`
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join('\n')}
${postEntries.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
