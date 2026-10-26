/*
 * Shared by the app (src/lib/posts.ts) and the build-time SEO plugin
 * (vite-plugin-seo.ts), so it must not use browser or Vite-only APIs.
 *
 * Frontmatter is simple `key: value` lines, arrays as `[a, b]`.
 */

export const parseFrontmatter = (raw: string) => {
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
