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
		title: 'Byte Charts | Data Visualization Studio',
		description:
			'Byte Charts turns complex data into visual stories, motion graphics, and interactive explainers.',
		path: '/',
		schemaType: 'WebSite',
		image: '/images/byte-charts.webp'
	},
	about: {
		title: 'About Us | Byte Charts',
		description:
			'Byte Charts is a data visualization studio creating clear, compelling visual stories from complex information.',
		path: '/about',
		schemaType: 'AboutPage',
		image: '/images/byte-charts.webp'
	},
	gallery: {
		title: 'Gallery | Byte Charts',
		description:
			'Explore a curated collection of data visualizations, animated explainers, and visual experiments by Byte Charts.',
		path: '/gallery',
		schemaType: 'ImageGallery',
		image: '/images/byte-charts.webp'
	}
};

const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: 'Byte Charts',
	url: SITE_URL,
	logo: absoluteUrl('/images/byte-charts.webp'),
	email: 'contact@byte-charts.dev',
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'contact@byte-charts.dev',
		contactType: 'customer support'
	},
	sameAs
};
export const getStaticSeo = (key) => {
	const page = pages[key];
	if (!page) {
		throw new Error(`getStaticSeo: unknown page key "${key}"`);
	}
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
		jsonLd: key === 'home' ? [organizationJsonLd, jsonLd] : [jsonLd]
	};
};
