export const SITE_URL = 'https://byte-charts.dev';

const defaultImage = '/images/byte-charts.webp';

const sameAs = [
	'https://linkedin.com/company/byte-charts',
	'https://x.com/bytecharts1',
	'https://bsky.app/profile/byte-charts.dev',
	'https://github.com/bytecharts',
	'https://www.instagram.com/byte_charts/'
];

const absoluteUrl = (path) => {
	if (!path) return `${SITE_URL}${defaultImage}`;
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const pages = {
	home: {
		title: 'Byte Charts - Visual Stories',
		description:
			'Byte Charts turns complex data into visual stories, motion graphics, and interactive explainers.',
		path: '/',
		schemaType: 'WebSite'
	},
	about: {
		title: 'About Byte Charts',
		description:
			'Byte Charts is a data visualization studio creating visual stories from complex information.',
		path: '/about',
		schemaType: 'AboutPage'
	},
	gallery: {
		title: 'Visual Stories - Byte Charts',
		description:
			'A curated collection of data visualizations, animated explainers, and visual experiments.',
		path: '/gallery',
		schemaType: 'ImageGallery'
	},
	blog: {
		title: 'Notes - Byte Charts',
		description: 'Ideas, sketches, and notes on data visualization and visual storytelling.',
		path: '/blog',
		schemaType: 'CollectionPage'
	},
	contact: {
		title: 'Contact Byte Charts',
		description:
			'Start a data visualization, motion graphics, or interactive storytelling project with Byte Charts.',
		path: '/contact',
		schemaType: 'ContactPage'
	}
};

const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: 'Byte Charts',
	url: SITE_URL,
	logo: absoluteUrl('/images/byte-charts.webp'),
	sameAs
};

export const getStaticSeo = (key) => {
	const page = pages[key];
	const url = absoluteUrl(page.path);
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': page.schemaType,
		name: page.title,
		url,
		description: page.description
	};

	return {
		title: page.title,
		description: page.description,
		url,
		image: absoluteUrl(page.image),
		jsonLd: key === 'home' ? [organizationJsonLd, jsonLd] : jsonLd
	};
};

export const getBlogPostSeo = (meta, slug) => {
	const title = `${meta?.title ?? 'Post'} - Byte Charts`;
	const description = meta?.excerpt ?? 'A note from Byte Charts.';
	const url = absoluteUrl(`/blog/${slug}`);
	const image = absoluteUrl(meta?.cover);

	return {
		title,
		description,
		url,
		image,
		type: 'article',
		publishedTime: meta?.date,
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: meta?.title ?? 'Post',
			datePublished: meta?.date,
			description,
			image,
			url,
			author: { '@type': 'Person', name: 'Sathish' },
			publisher: {
				'@type': 'Organization',
				name: 'Byte Charts',
				logo: { '@type': 'ImageObject', url: absoluteUrl('/images/byte-charts.webp') }
			}
		}
	};
};
