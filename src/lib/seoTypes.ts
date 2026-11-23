/*
 * Contract between the app (src/lib/seo.ts) and the build plugin (vite-plugin-seo.ts),
 * so it must not import browser or Vite-only code.
 */

export interface PrerenderPage {
	/** Path of the page, with its language prefix. */
	path: string;
	/** Where search engines should look; differs from `path` when the page has no translation of its own. */
	canonicalPath: string;
	htmlLang: string;
	title: string;
	description: string;
	type: "website" | "article";
	/** The same page in every language it is translated to. */
	alternates: { hrefLang: string; path: string }[];
	/** Image in public/og, without extension or language; the home image is used when there is none. */
	image: string;
	publishedTime?: string;
	/** Source module loaded lazily by this page, so its files can be preloaded. */
	lazyModule?: string;
	jsonLd: (absoluteUrl: (path: string) => string, image?: string) => Record<string, unknown>;
}

export interface ServerEntry {
	getPages: () => PrerenderPage[];
	NOT_FOUND_PAGE: PrerenderPage;
	render: (path: string) => Promise<string>;
}
