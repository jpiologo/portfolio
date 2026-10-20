import type { Post } from "./types";

/*
 * Blog posts live in `src/posts/<slug>/index.md`. Images referenced by a post
 * (cover or inline) sit next to its `index.md` and are bundled by Vite.
 *
 * Frontmatter (simple `key: value` lines, arrays as `[a, b]`):
 *   title, date (YYYY-MM-DD), description, cover, draft
 */

const markdownFiles = import.meta.glob("../posts/*/index.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const assetFiles = import.meta.glob(
	"../posts/*/**/*.{png,jpg,jpeg,gif,webp,avif,svg}",
	{ eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const WORDS_PER_MINUTE = 200;

const parseFrontmatter = (raw: string) => {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { data: {} as Record<string, string | string[]>, content: raw };

	const data: Record<string, string | string[]> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const separator = line.indexOf(":");
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();

		data[key] =
			value.startsWith("[") && value.endsWith("]")
				? value
						.slice(1, -1)
						.split(",")
						.map((item) => stripQuotes(item.trim()))
						.filter(Boolean)
				: stripQuotes(value);
	}

	return { data, content: match[2] };
};

const stripQuotes = (value: string) => value.replace(/^(['"])(.*)\1$/, "$2");

/** Resolves an image path relative to the post folder into its bundled URL. */
export const resolvePostAsset = (slug: string, src?: string) => {
	if (!src || /^(https?:|data:|\/)/.test(src)) return src;
	const normalized = src.replace(/^\.\//, "");
	return assetFiles[`../posts/${slug}/${normalized}`] ?? src;
};

const toPost = (path: string, raw: string): Post => {
	const segments = path.split("/");
	const slug = segments[segments.length - 2];
	const { data, content } = parseFrontmatter(raw);
	const words = content.trim().split(/\s+/).length;
	const asString = (value: string | string[] | undefined) =>
		typeof value === "string" ? value : "";

	return {
		slug,
		title: asString(data.title) || slug,
		date: asString(data.date),
		description: asString(data.description),
		cover: resolvePostAsset(slug, asString(data.cover) || undefined),
		draft: data.draft === "true",
		readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
		content,
	};
};

// Drafts show up while running `npm run dev`, never in production builds.
export const posts: Post[] = Object.entries(markdownFiles)
	.map(([path, raw]) => toPost(path, raw))
	.filter((post) => !(post.draft && import.meta.env.PROD))
	.sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((post) => post.slug === slug);

// Lowercase, accent-free text so "funcao" matches "Função"
const normalize = (text: string) =>
	text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const searchIndex = new Map(
	posts.map((post) => [
		post.slug,
		normalize([post.title, post.description, post.content].join(" ")),
	]),
);

/** Posts containing every word of the query in their title, description or body. */
export const searchPosts = (query: string) => {
	const terms = normalize(query).split(/\s+/).filter(Boolean);
	if (terms.length === 0) return posts;
	return posts.filter((post) => {
		const text = searchIndex.get(post.slug) ?? "";
		return terms.every((term) => text.includes(term));
	});
};

export const formatPostDate = (date: string) =>
	new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
