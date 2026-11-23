import type { Language } from "../i18n/language";
import { parseFrontmatter } from "./frontmatter";
import { getPosts, slugFromPath } from "./posts";

/* Text of every post. Only the lazily loaded blog pages may import this, to keep it out of the main bundle. */

// Vite needs the glob options written inline, so they can't be shared through a constant
const englishFiles = import.meta.glob<string>("../posts/*/index.md", { eager: true, query: "?raw", import: "default" });

const portugueseFiles = import.meta.glob<string>("../posts/*/index.pt.md", {
	eager: true,
	query: "?raw",
	import: "default",
});

const toContents = (files: Record<string, string>) =>
	new Map(Object.entries(files).map(([path, raw]) => [slugFromPath(path), parseFrontmatter(raw).content]));

const englishContents = toContents(englishFiles);

const CONTENTS: Record<Language, Map<string, string>> = {
	en: englishContents,
	pt: toContents(portugueseFiles),
};

// Posts without a Portuguese version fall back to English
export const getPostContent = (slug: string, language: Language) =>
	CONTENTS[language].get(slug) ?? englishContents.get(slug) ?? "";

// Lowercase, accent-free text so "funcao" matches "Função"
const normalize = (text: string) =>
	text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();

const buildSearchIndex = (language: Language) =>
	new Map(
		getPosts(language).map((post) => [
			post.slug,
			normalize([post.title, post.description, getPostContent(post.slug, language)].join(" ")),
		]),
	);

const SEARCH_INDEX: Record<Language, Map<string, string>> = {
	en: buildSearchIndex("en"),
	pt: buildSearchIndex("pt"),
};

/** Posts containing every word of the query in their title, description or body. */
export const searchPosts = (query: string, language: Language) => {
	const posts = getPosts(language);
	const terms = normalize(query).split(/\s+/).filter(Boolean);
	if (terms.length === 0) return posts;
	return posts.filter((post) => {
		const text = SEARCH_INDEX[language].get(post.slug) ?? "";
		return terms.every((term) => text.includes(term));
	});
};
