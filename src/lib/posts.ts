import { parseFrontmatter } from "./frontmatter";
import type { Post } from "./types";
import type { Language } from "../i18n/language";

/*
 * Blog posts live in `src/posts/<slug>/index.md` (English). An optional `index.pt.md` next to it
 * holds the Portuguese title, description and body; date, cover and draft always come from
 * `index.md`, so the two versions can't drift apart. Images referenced by a post (cover or
 * inline) sit next to its `index.md` and are bundled by Vite.
 *
 * Frontmatter (simple `key: value` lines, arrays as `[a, b]`):
 *   index.md:    title, date (YYYY-MM-DD), description, cover, draft
 *   index.pt.md: title, description
 */

// Vite needs the glob options written inline, so they can't be shared through a constant
const englishFiles = import.meta.glob("../posts/*/index.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const portugueseFiles = import.meta.glob("../posts/*/index.pt.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const assetFiles = import.meta.glob(
	"../posts/*/**/*.{png,jpg,jpeg,gif,webp,avif,svg}",
	{ eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const WORDS_PER_MINUTE = 200;

/** Resolves an image path relative to the post folder into its bundled URL. */
export const resolvePostAsset = (slug: string, src?: string) => {
	if (!src || /^(https?:|data:|\/)/.test(src)) return src;
	const normalized = src.replace(/^\.\//, "");
	return assetFiles[`../posts/${slug}/${normalized}`] ?? src;
};

const slugFromPath = (path: string) => {
	const segments = path.split("/");
	return segments[segments.length - 2];
};

const asString = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const readingMinutes = (content: string) =>
	Math.max(1, Math.round(content.trim().split(/\s+/).length / WORDS_PER_MINUTE));

const toPost = (path: string, raw: string): Post => {
	const slug = slugFromPath(path);
	const { data, content } = parseFrontmatter(raw);

	return {
		slug,
		title: asString(data.title) || slug,
		date: asString(data.date),
		description: asString(data.description),
		cover: resolvePostAsset(slug, asString(data.cover) || undefined),
		draft: data.draft === "true",
		readingMinutes: readingMinutes(content),
		content,
	};
};

const withTranslation = (post: Post, raw: string): Post => {
	const { data, content } = parseFrontmatter(raw);
	return {
		...post,
		title: asString(data.title) || post.title,
		description: asString(data.description) || post.description,
		content,
		readingMinutes: readingMinutes(content),
	};
};

// Drafts show up while running `npm run dev`, never in production builds.
const englishPosts: Post[] = Object.entries(englishFiles)
	.map(([path, raw]) => toPost(path, raw))
	.filter((post) => !(post.draft && import.meta.env.PROD))
	.sort((a, b) => b.date.localeCompare(a.date));

const portugueseRawBySlug = new Map(Object.entries(portugueseFiles).map(([path, raw]) => [slugFromPath(path), raw]));

// Posts without a Portuguese version fall back to English
const POSTS: Record<Language, Post[]> = {
	en: englishPosts,
	pt: englishPosts.map((post) => {
		const raw = portugueseRawBySlug.get(post.slug);
		return raw ? withTranslation(post, raw) : post;
	}),
};

export const getPosts = (language: Language) => POSTS[language];

export const getPost = (slug: string, language: Language) => POSTS[language].find((post) => post.slug === slug);

// Lowercase, accent-free text so "funcao" matches "Função"
const normalize = (text: string) =>
	text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const buildSearchIndex = (posts: Post[]) =>
	new Map(posts.map((post) => [post.slug, normalize([post.title, post.description, post.content].join(" "))]));

const SEARCH_INDEX: Record<Language, Map<string, string>> = {
	en: buildSearchIndex(POSTS.en),
	pt: buildSearchIndex(POSTS.pt),
};

/** Posts containing every word of the query in their title, description or body. */
export const searchPosts = (query: string, language: Language) => {
	const posts = POSTS[language];
	const terms = normalize(query).split(/\s+/).filter(Boolean);
	if (terms.length === 0) return posts;
	return posts.filter((post) => {
		const text = SEARCH_INDEX[language].get(post.slug) ?? "";
		return terms.every((term) => text.includes(term));
	});
};

export const formatPostDate = (date: string, locale: string) =>
	new Date(`${date}T00:00:00`).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
