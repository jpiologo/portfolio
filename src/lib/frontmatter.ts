/*
 * Shared by the app (src/lib/postContents.ts) and a build plugin
 * (vite-plugin-post-meta.ts), so it must not use browser or Vite-only APIs.
 *
 * Frontmatter is simple `key: value` lines, arrays as `[a, b]`.
 */

type Frontmatter = Record<string, string | string[]>;

/** What vite-plugin-post-meta.ts exposes about a post without its text. */
export interface PostMeta {
	data: Frontmatter;
	readingMinutes: number;
}

const WORDS_PER_MINUTE = 200;

export const readingMinutes = (content: string) =>
	Math.max(1, Math.round(content.trim().split(/\s+/).length / WORDS_PER_MINUTE));

export const parseFrontmatter = (raw: string) => {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { data: {} as Frontmatter, content: raw };

	const data: Frontmatter = {};
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
