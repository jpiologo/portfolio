import type { HtmlTagDescriptor, Plugin } from "vite";
import { ACTIVE_FONT_PRESET, FONT_PRESETS, type FontPreset, SIGNATURE_STYLESHEET } from "./fonts.config";

/*
 * Applies the active preset from fonts.config.ts:
 *   - `virtual:site-fonts` (imported by main.tsx) bundles the preset's self-hosted fonts;
 *   - index.html gets a :root block with one CSS variable per font role, a preload for the
 *     main font file, and Google Fonts only for families that are not self-hosted.
 * Done at build time (not in React) so fonts start downloading with the page.
 */

const ROLES = ["hero", "heading", "title", "body", "mono", "label"] as const satisfies readonly (keyof FontPreset)[];

const VIRTUAL_ID = "virtual:site-fonts";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const googleFontsUrl = (families: string[]) =>
	`https://fonts.googleapis.com/css2?${families
		.map((family) => `family=${family.trim().replace(/ /g, "+")}`)
		.join("&")}&display=swap`;

const googleFontsTags = (families: string[]): HtmlTagDescriptor[] =>
	families.length === 0
		? []
		: [
				{ tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" }, injectTo: "head" },
				{ tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }, injectTo: "head" },
				{ tag: "link", attrs: { rel: "stylesheet", href: googleFontsUrl(families) }, injectTo: "head" },
			];

export default function fonts(): Plugin {
	const preset: FontPreset = FONT_PRESETS[ACTIVE_FONT_PRESET];

	return {
		name: "portfolio-fonts",

		resolveId(id) {
			return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
		},

		load(id) {
			if (id !== RESOLVED_ID) return;
			return [...preset.stylesheets, SIGNATURE_STYLESHEET].map((file) => `import ${JSON.stringify(file)};`).join("\n");
		},

		transformIndexHtml: {
			order: "post",
			handler(_html, { bundle = {} }) {
				const cssVariables = ROLES.map((role) => `--font-${role}: ${preset[role]};`).join(" ");
				const { preload } = preset;
				const preloaded = preload ? Object.keys(bundle).find((file) => file.includes(preload)) : undefined;

				return [
					...googleFontsTags(preset.googleFonts),
					...(preloaded
						? [
								{
									tag: "link",
									attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${preloaded}`, crossorigin: true },
									injectTo: "head" as const,
								},
							]
						: []),
					{
						tag: "style",
						attrs: { "data-font-preset": ACTIVE_FONT_PRESET },
						children: `:root { ${cssVariables} }`,
						injectTo: "head",
					},
				];
			},
		},
	};
}
