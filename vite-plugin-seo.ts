import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import { build, type Plugin, type ResolvedConfig } from "vite";
import { FULL_NAME } from "./src/lib/profile";
import type { PrerenderPage, ServerEntry } from "./src/lib/seoTypes";
import postMeta from "./vite-plugin-post-meta";

/*
 * The app is a client-rendered SPA, so on build this plugin renders every page listed in
 * src/lib/seo.ts (through src/entry-server.tsx) into its own HTML file, with title, description,
 * canonical, hreflang, Open Graph and JSON-LD in <head>. The browser then hydrates that HTML.
 * It also writes `404.html`, `sitemap.xml` and `robots.txt`.
 *
 * The public URL comes from SITE_URL, falling back to the domain Vercel or
 * Netlify expose during their builds.
 */

const SERVER_ENTRY = "src/entry-server.tsx";
const SERVER_OUT_DIR = "node_modules/.prerender";
const SERVER_FILE = "entry-server.mjs";

const OG_DIR = "og";
const OG_EXTENSION = ".jpg";
const OG_DEFAULT = "home";
const OG_SIZE = { width: 1200, height: 630 };

const ROOT_ELEMENT = '<div id="root"></div>';

const resolveSiteUrl = () => {
	const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	const url =
		process.env.SITE_URL ||
		(vercelDomain && `https://${vercelDomain}`) ||
		process.env.URL || // Netlify
		"";
	return url.replace(/\/$/, "");
};

const escapeHtml = (text: string) =>
	text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const ogLocale = (htmlLang: string) => (htmlLang === "pt-BR" ? "pt_BR" : "en_US");

export default function seo(): Plugin {
	let config: ResolvedConfig;
	/** Built files of each lazily loaded source module. */
	const lazyFiles = new Map<string, { scripts: string[]; styles: string[] }>();
	const siteUrl = resolveSiteUrl();

	const absoluteUrl = (pagePath: string) => `${siteUrl}${pagePath}`;

	const writeFile = (relativePath: string, content: string) => {
		const target = path.join(config.build.outDir, relativePath);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, content);
	};

	/** Image made for this page and language, else for the page, else the home one. */
	const ogImage = (page: PrerenderPage) => {
		const language = page.htmlLang.slice(0, 2);
		const candidates = [page.image, OG_DEFAULT].flatMap((name) => [`${name}.${language}`, name]);
		const found = candidates.find((name) => fs.existsSync(path.join(config.publicDir, OG_DIR, name + OG_EXTENSION)));
		return found && absoluteUrl(`/${OG_DIR}/${found}${OG_EXTENSION}`);
	};

	const renderHead = (page: PrerenderPage, { isIndexed = true } = {}) => {
		const image = ogImage(page);
		const url = absoluteUrl(page.canonicalPath);
		const jsonLd = { "@context": "https://schema.org", ...page.jsonLd(absoluteUrl, image) };
		const lazy = page.lazyModule ? lazyFiles.get(page.lazyModule) : undefined;
		const xDefault = page.alternates[0];

		const tags = [
			`<title>${escapeHtml(page.title)}</title>`,
			`<meta name="description" content="${escapeHtml(page.description)}" />`,
			...(isIndexed
				? [
						`<link rel="canonical" href="${url}" />`,
						...page.alternates.map(
							({ hrefLang, path: alternate }) =>
								`<link rel="alternate" hreflang="${hrefLang}" href="${absoluteUrl(alternate)}" />`,
						),
						xDefault && `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(xDefault.path)}" />`,
					]
				: [`<meta name="robots" content="noindex" />`]),
			`<meta name="author" content="${FULL_NAME}" />`,
			`<meta property="og:site_name" content="${FULL_NAME}" />`,
			`<meta property="og:type" content="${page.type}" />`,
			`<meta property="og:title" content="${escapeHtml(page.title)}" />`,
			`<meta property="og:description" content="${escapeHtml(page.description)}" />`,
			`<meta property="og:url" content="${url}" />`,
			`<meta property="og:locale" content="${ogLocale(page.htmlLang)}" />`,
			...(image
				? [
						`<meta property="og:image" content="${image}" />`,
						`<meta property="og:image:width" content="${OG_SIZE.width}" />`,
						`<meta property="og:image:height" content="${OG_SIZE.height}" />`,
					]
				: []),
			page.publishedTime && `<meta property="article:published_time" content="${page.publishedTime}" />`,
			`<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
			// Escape "<" so page text can never close the script tag
			`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
			...(lazy
				? [
						...lazy.scripts.map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
						...lazy.styles.map((file) => `<link rel="stylesheet" crossorigin href="/${file}" />`),
					]
				: []),
		];
		return tags.filter(Boolean).join("\n    ");
	};

	const renderSitemap = (pages: PrerenderPage[]) => {
		const urls = pages
			.filter((page) => page.canonicalPath === page.path)
			.map((page) => {
				const links = page.alternates.map(
					({ hrefLang, path: alternate }) =>
						`<xhtml:link rel="alternate" hreflang="${hrefLang}" href="${absoluteUrl(alternate)}"/>`,
				);
				const lastmod = page.publishedTime ? `<lastmod>${page.publishedTime}</lastmod>` : "";
				return `  <url><loc>${absoluteUrl(page.path)}</loc>${lastmod}${links.join("")}</url>`;
			});
		return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
	};

	const loadServerEntry = async (): Promise<ServerEntry> => {
		const outDir = path.join(config.root, SERVER_OUT_DIR);
		await build({
			configFile: false,
			root: config.root,
			mode: config.mode,
			logLevel: "warn",
			plugins: [react(), postMeta()],
			build: {
				ssr: SERVER_ENTRY,
				outDir,
				emptyOutDir: true,
				copyPublicDir: false,
				rollupOptions: { output: { entryFileNames: SERVER_FILE } },
			},
			// Bundled, so packages that only ship CommonJS work too
			ssr: { noExternal: true },
		});
		return import(pathToFileURL(path.join(outDir, SERVER_FILE)).href);
	};

	return {
		name: "portfolio-seo",
		apply: "build",

		configResolved(resolved) {
			config = resolved;
		},

		generateBundle(_options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type !== "chunk" || !file.isDynamicEntry || !file.facadeModuleId) continue;
				const source = path.relative(config.root, file.facadeModuleId).replace(/\\/g, "/");
				const shared = file.imports.filter((name) => {
					const imported = bundle[name];
					return imported?.type === "chunk" && !imported.isEntry;
				});
				lazyFiles.set(source, {
					scripts: [file.fileName, ...shared],
					styles: [...(file.viteMetadata?.importedCss ?? [])],
				});
			}
		},

		async closeBundle() {
			if (!siteUrl) {
				config.logger.warn(
					"\n[portfolio-seo] SITE_URL is not set: canonical URLs and sitemap.xml will use relative paths.",
				);
			}

			const template = fs.readFileSync(path.join(config.build.outDir, "index.html"), "utf-8");
			if (!template.includes(ROOT_ELEMENT)) throw new Error(`[portfolio-seo] index.html must contain ${ROOT_ELEMENT}`);

			const { getPages, NOT_FOUND_PAGE, render } = await loadServerEntry();

			// Replacer functions, because page text may contain "$&" and other replacement patterns
			const renderPage = async (page: PrerenderPage, head: string) => {
				const body = await render(page.path);
				return template
					.replace(/<html lang="[^"]*"/, () => `<html lang="${page.htmlLang}"`)
					.replace(/<title>[\s\S]*?<\/title>/, () => head)
					.replace(ROOT_ELEMENT, () => `<div id="root" data-page="${page.path}">${body}</div>`);
			};

			const pages = getPages();
			for (const page of pages) {
				writeFile(path.join(page.path, "index.html"), await renderPage(page, renderHead(page)));
			}
			writeFile("404.html", await renderPage(NOT_FOUND_PAGE, renderHead(NOT_FOUND_PAGE, { isIndexed: false })));

			writeFile("sitemap.xml", renderSitemap(pages));
			writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
			config.logger.info(`[portfolio-seo] ${pages.length} pages prerendered`);
		},
	};
}
