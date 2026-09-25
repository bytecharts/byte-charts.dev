// Static HTML for every route (home, gallery, about) — all page data is
// fetched client-side in onMount, so server render is deterministic.
// sitemap.xml opts in via its own +server.js export.
export const prerender = true;
