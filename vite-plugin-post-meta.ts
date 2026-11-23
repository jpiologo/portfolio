import fs from "node:fs";
import type { Plugin } from "vite";
import { parseFrontmatter, readingMinutes } from "./src/lib/frontmatter";

const QUERY = "?meta";

/** `post.md?meta` imports a post's frontmatter and reading time without its text, to keep posts out of the main bundle. */
export default function postMeta(): Plugin {
	return {
		name: "portfolio-post-meta",
		enforce: "pre",

		load(id) {
			if (!id.endsWith(`.md${QUERY}`)) return;
			const file = id.slice(0, -QUERY.length);
			this.addWatchFile(file);
			const { data, content } = parseFrontmatter(fs.readFileSync(file, "utf-8"));
			return `export default ${JSON.stringify({ data, readingMinutes: readingMinutes(content) })}`;
		},
	};
}
