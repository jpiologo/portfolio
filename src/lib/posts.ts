import type { PostMeta } from "./frontmatter";
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
 *
 * This module only knows about the posts (vite-plugin-post-meta.ts). Their text is in
 * postContents.ts, which the lazily loaded blog pages import.
 */

// Vite needs the glob options written inline, so they can't be shared through a constant
const englishFiles = import.meta.glob<PostMeta>("../posts/*/index.md", {
	eager: true,
	query: "?meta",
	import: "default",
});

const portugueseFiles = import.meta.glob<PostMeta>("../posts/*/index.pt.md", {
	eager: true,
	query: "?meta",
	import: "default",
});

const assetFiles = import.meta.glob<string>("../posts/*/**/*.{png,jpg,jpeg,gif,webp,avif,svg}", {
	eager: true,
	query: "?url",
	import: "default",
});

/** Resolves an image path relative to the post folder into its bundled URL. */
export const resolvePostAsset = (slug: string, src?: string) => {
	if (!src || /^(https?:|data:|\/)/.test(src)) return src;
	const normalized = src.replace(/^\.\//, "");
	return assetFiles[`../posts/${slug}/${normalized}`] ?? src;
};

export const slugFromPath = (path: string) => {
	const segments = path.split("/");
	return segments[segments.length - 2];
};

const asString = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const toPost = (path: string, { data, readingMinutes }: PostMeta): Post => {
	const slug = slugFromPath(path);
	return {
		slug,
		title: asString(data.title) || slug,
		date: asString(data.date),
		description: asString(data.description),
		cover: resolvePostAsset(slug, asString(data.cover) || undefined),
		draft: data.draft === "true",
		readingMinutes,
		isTranslated: true,
	};
};

const withTranslation = (post: Post, { data, readingMinutes }: PostMeta): Post => ({
	...post,
	title: asString(data.title) || post.title,
	description: asString(data.description) || post.description,
	readingMinutes,
});

// Drafts show up while running `npm run dev`, never in production builds.
const englishPosts: Post[] = Object.entries(englishFiles)
	.map(([path, meta]) => toPost(path, meta))
	.filter((post) => !(post.draft && import.meta.env.PROD))
	.sort((a, b) => b.date.localeCompare(a.date));

const portugueseBySlug = new Map(Object.entries(portugueseFiles).map(([path, meta]) => [slugFromPath(path), meta]));

// Posts without a Portuguese version fall back to English
const POSTS: Record<Language, Post[]> = {
	en: englishPosts,
	pt: englishPosts.map((post) => {
		const meta = portugueseBySlug.get(post.slug);
		return meta ? withTranslation(post, meta) : { ...post, isTranslated: false };
	}),
};

export const getPosts = (language: Language) => POSTS[language];

export const getPost = (slug: string, language: Language) => POSTS[language].find((post) => post.slug === slug);

/** The post listed after this one, going back to the first after the last; none when it is the only post. */
export const getNextPost = (slug: string, language: Language) => {
	const posts = POSTS[language];
	const next = posts[(posts.findIndex((post) => post.slug === slug) + 1) % posts.length];
	return next.slug === slug ? undefined : next;
};

export const formatPostDate = (date: string, locale: string) =>
	new Date(`${date}T00:00:00`).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
