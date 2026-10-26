import type { Plugin } from "vite";
import { ACTIVE_FONT_PRESET, FONT_PRESETS, type FontPreset } from "./fonts.config";

/*
 * Applies the active preset from fonts.config.ts to index.html:
 *   - a Google Fonts stylesheet for just that preset's families;
 *   - a :root block that defines one CSS variable per font role.
 * Done at build time (not in React) so fonts start downloading with the page.
 */

const ROLES = ["hero", "heading", "title", "body", "mono", "label"] as const satisfies readonly (keyof FontPreset)[];

const googleFontsUrl = (families: string[]) =>
	`https://fonts.googleapis.com/css2?${families
		.map((family) => `family=${family.trim().replace(/ /g, "+")}`)
		.join("&")}&display=swap`;

export default function fonts(): Plugin {
	const preset: FontPreset = FONT_PRESETS[ACTIVE_FONT_PRESET];

	return {
		name: "portfolio-fonts",

		transformIndexHtml() {
			const cssVariables = ROLES.map((role) => `--font-${role}: ${preset[role]};`).join(" ");

			return [
				{
					tag: "link",
					attrs: { rel: "stylesheet", href: googleFontsUrl(preset.googleFonts) },
					injectTo: "head",
				},
				{
					tag: "style",
					attrs: { "data-font-preset": ACTIVE_FONT_PRESET },
					children: `:root { ${cssVariables} }`,
					injectTo: "head",
				},
			];
		},
	};
}
