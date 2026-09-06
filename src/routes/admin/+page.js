import { redirect } from '@sveltejs/kit';

// The CMS lives in static/admin/index.html. SvelteKit doesn't serve
// directory indexes for static folders, so /admin (and /admin/) 404.
// Redirect to the exact file instead.
export const load = () => {
	throw redirect(307, '/admin/index.html');
};
