import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Plugin, ResolvedConfig } from "vite";
import { parseFrontmatter } from "./src/lib/frontmatter";

/*
 * The app is a client-rendered SPA, so every URL used to return the same empty
 * `index.html`. This plugin gives search engines real pages:
 *   - injects title, description, canonical, Open Graph and JSON-LD into <head>;
 *   - on build, writes `blog/index.html` and `blog/<slug>/index.html` with the
 *     post already rendered inside #root (React replaces it once it loads);
 *   - on build, writes `sitemap.xml` and `robots.txt`.
 *
 * The public URL comes from SITE_URL, falling back to the domain Vercel or
 * Netlify expose during their builds.
 */

const AUTHOR = "João Piologo";
const SOCIAL_PROFILES = [
	"https://github.com/jpiologo",
	"https://www.linkedin.com/in/jo%C3%A3o-piologo-85ba9a226/",
];

const HOME = {
	title: "João Piologo - Software Engineer",
	description:
		"João Piologo is a full stack software engineer. Projects, experience and blog posts about Fluig, CI/CD with Jenkins and web development.",
};

const BLOG = {
	title: "Blog | João Piologo",
	description: "Every post I've written about software engineering and technology.",
};

// Social networks don't render SVG previews, so only raster covers become og:image
const RASTER_IMAGE = /\.(png|jpe?g|gif|webp|avif)$/i;
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

interface SeoPost {
	slug: string;
	title: string;
	date: string;
	description: string;
	coverFile?: string;
	content: string;
}

interface PageMeta {
	title: string;
	description: string;
	url: string;
	type: "website" | "article";
	image?: string;
	publishedTime?: string;
	jsonLd: Record<string, unknown>;
}

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

const loadPosts = (postsDir: string): SeoPost[] =>
	fs
		.readdirSync(postsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && fs.existsSync(path.join(postsDir, entry.name, "index.md")))
		.map((entry) => {
			const raw = fs.readFileSync(path.join(postsDir, entry.name, "index.md"), "utf-8");
			const { data, content } = parseFrontmatter(raw);
			const asString = (value: string | string[] | undefined) =>
				typeof value === "string" ? value : "";
			const cover = asString(data.cover).replace(/^\.\//, "");

			return {
				slug: entry.name,
				title: asString(data.title) || entry.name,
				date: asString(data.date),
				description: asString(data.description),
				coverFile: RASTER_IMAGE.test(cover) ? cover : undefined,
				content,
				draft: data.draft === "true",
			};
		})
		.filter((post) => !post.draft)
		.sort((a, b) => b.date.localeCompare(a.date));

const renderHead = (page: PageMeta) => {
	const tags = [
		`<title>${escapeHtml(page.title)}</title>`,
		`<meta name="description" content="${escapeHtml(page.description)}" />`,
		`<meta name="author" content="${AUTHOR}" />`,
		`<link rel="canonical" href="${page.url}" />`,
		`<meta property="og:type" content="${page.type}" />`,
		`<meta property="og:site_name" content="${AUTHOR}" />`,
		`<meta property="og:title" content="${escapeHtml(page.title)}" />`,
		`<meta property="og:description" content="${escapeHtml(page.description)}" />`,
		`<meta property="og:url" content="${page.url}" />`,
		page.image && `<meta property="og:image" content="${page.image}" />`,
		page.publishedTime && `<meta property="article:published_time" content="${page.publishedTime}" />`,
		`<meta name="twitter:card" content="${page.image ? "summary_large_image" : "summary"}" />`,
		// Escape "<" so post text can never close the script tag
		`<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>`,
	];
	return `<!-- seo:start -->\n    ${tags.filter(Boolean).join("\n    ")}\n    <!-- seo:end -->`;
};

// Relative images point at hashed bundle files, so they only show once React renders
const renderMarkdown = (content: string) =>
	renderToStaticMarkup(
		createElement(Markdown, {
			children: content,
			remarkPlugins: [remarkGfm],
			components: {
				img: ({ src, alt }) =>
					src && /^https?:/.test(src) ? createElement("img", { src, alt: alt ?? "" }) : null,
			},
		}),
	);

const renderPostBody = (post: SeoPost) => `
<article class="pt-32 pb-24 bg-background-base min-h-screen">
	<div class="max-w-3xl mx-auto px-4">
		<header class="mb-10">
			<h1 class="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-5">${escapeHtml(post.title)}</h1>
			${post.description ? `<p class="text-xl text-text-muted font-light leading-relaxed mb-6">${escapeHtml(post.description)}</p>` : ""}
			${post.date ? `<time datetime="${post.date}" class="text-sm text-text-muted">${post.date}</time>` : ""}
		</header>
		<div class="post-content prose dark:prose-invert prose-lg max-w-none">${renderMarkdown(post.content)}</div>
	</div>
</article>`;

const renderBlogBody = (posts: SeoPost[]) => `
<section class="pt-32 pb-24 bg-background-base min-h-screen">
	<div class="max-w-6xl mx-auto px-4">
		<h1 class="text-4xl md:text-5xl font-bold mb-6 text-text-primary tracking-tight">Blog</h1>
		<p class="text-xl text-text-muted leading-relaxed font-light mb-10">${escapeHtml(BLOG.description)}</p>
		<ul>
			${posts
				.map(
					(post) => `<li class="mb-8">
				<h2 class="text-2xl font-bold text-text-primary"><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h2>
				<p class="text-text-muted">${escapeHtml(post.description)}</p>
			</li>`,
				)
				.join("\n\t\t\t")}
		</ul>
	</div>
</section>`;

const renderSitemap = (siteUrl: string, posts: SeoPost[]) => {
	const entries = [
		{ loc: `${siteUrl}/` },
		{ loc: `${siteUrl}/blog`, lastmod: posts[0]?.date },
		...posts.map((post) => ({ loc: `${siteUrl}/blog/${post.slug}`, lastmod: post.date })),
	];
	const urls = entries.map(
		({ loc, lastmod }) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
	);
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
};

export default function seo(): Plugin {
	let config: ResolvedConfig;
	const siteUrl = resolveSiteUrl();

	const writeFile = (relativePath: string, content: string | Buffer) => {
		const target = path.join(config.build.outDir, relativePath);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, content);
	};

	return {
		name: "portfolio-seo",

		configResolved(resolved) {
			config = resolved;
		},

		transformIndexHtml(html) {
			return html.replace(
				/<title>[\s\S]*?<\/title>/,
				renderHead({
					...HOME,
					url: `${siteUrl}/`,
					type: "website",
					jsonLd: {
						"@context": "https://schema.org",
						"@type": "Person",
						name: AUTHOR,
						jobTitle: "Software Engineer",
						url: `${siteUrl}/`,
						sameAs: SOCIAL_PROFILES,
					},
				}),
			);
		},

		closeBundle() {
			if (config.command !== "build") return;
			if (!siteUrl) {
				config.logger.warn(
					"\n[portfolio-seo] SITE_URL is not set: canonical URLs and sitemap.xml will use relative paths.",
				);
			}

			const template = fs.readFileSync(path.join(config.build.outDir, "index.html"), "utf-8");
			const renderPage = (meta: PageMeta, body: string) =>
				template
					.replace(SEO_BLOCK, renderHead(meta))
					.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

			const posts = loadPosts(path.join(config.root, "src/posts"));

			writeFile(
				"blog/index.html",
				renderPage(
					{
						...BLOG,
						url: `${siteUrl}/blog`,
						type: "website",
						jsonLd: {
							"@context": "https://schema.org",
							"@type": "Blog",
							name: BLOG.title,
							description: BLOG.description,
							url: `${siteUrl}/blog`,
							author: { "@type": "Person", name: AUTHOR, url: `${siteUrl}/` },
						},
					},
					renderBlogBody(posts),
				),
			);

			for (const post of posts) {
				const url = `${siteUrl}/blog/${post.slug}`;
				let image: string | undefined;

				// Copy the cover to a stable, unhashed path that social previews can fetch
				if (post.coverFile) {
					const source = path.join(config.root, "src/posts", post.slug, post.coverFile);
					if (fs.existsSync(source)) {
						const fileName = `cover${path.extname(post.coverFile)}`;
						writeFile(`blog/${post.slug}/${fileName}`, fs.readFileSync(source));
						image = `${url}/${fileName}`;
					}
				}

				writeFile(
					`blog/${post.slug}/index.html`,
					renderPage(
						{
							title: `${post.title} | ${AUTHOR}`,
							description: post.description,
							url,
							type: "article",
							image,
							publishedTime: post.date,
							jsonLd: {
								"@context": "https://schema.org",
								"@type": "BlogPosting",
								headline: post.title,
								description: post.description,
								datePublished: post.date,
								dateModified: post.date,
								url,
								mainEntityOfPage: url,
								...(image && { image }),
								author: { "@type": "Person", name: AUTHOR, url: `${siteUrl}/` },
							},
						},
						renderPostBody(post),
					),
				);
			}

			writeFile("sitemap.xml", renderSitemap(siteUrl, posts));
			writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
		},
	};
}
