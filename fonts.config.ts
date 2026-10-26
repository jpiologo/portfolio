/*
 * Site typography: the single place to change the portfolio's fonts.
 *
 * To switch fonts, change ACTIVE_FONT_PRESET below to another preset name.
 * To try something new, add a preset with the same shape and point to it.
 *
 * vite-plugin-fonts.ts reads this file, loads the active preset's Google Fonts
 * and exposes every role as a CSS variable (--font-hero, --font-heading, ...).
 * Tailwind (font-sans, font-display, font-heading, font-title, font-mono,
 * font-label) and src/index.css only ever use those variables.
 * Vite restarts the dev server by itself when this file changes.
 */

export interface FontPreset {
	/**
	 * Google Fonts families to load, written as in the Google Fonts URL after `family=`
	 * (spaces are fine), e.g. "Geist:wght@400..800".
	 */
	googleFonts: string[];
	/** The big "Full Stack Developer;" title and the hero subtitle */
	hero: string;
	/** Page and section headings (h1, h2), e.g. "Featured Projects" */
	heading: string;
	/** Card titles and smaller headings (h3–h6) */
	title: string;
	/** Running text, nav, buttons and forms */
	body: string;
	/** Code blocks and inline code */
	mono: string;
	/** Small uppercase labels, e.g. "FULL-STACK ARCHITECTURE" on project cards */
	label: string;
}

// Fallbacks used while a web font loads (or if it fails to)
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "ui-monospace, SFMono-Regular, Consolas, monospace";

export const FONT_PRESETS = {
	modern: {
		googleFonts: ["Geist:wght@300..800", "Geist Mono:wght@400..600"],
		hero: `'Geist', ${SANS}`,
		heading: `'Geist', ${SANS}`,
		title: `'Geist', ${SANS}`,
		body: `'Geist', ${SANS}`,
		mono: `'Geist Mono', ${MONO}`,
		label: `'Geist Mono', ${MONO}`,
	},
	editorial: {
		googleFonts: [
			"Cormorant Garamond:ital,wght@0,500..700;1,500..700",
			"Manrope:wght@300..800",
			"JetBrains Mono:wght@400..600",
		],
		hero: `'Cormorant Garamond', ${SERIF}`,
		heading: `'Cormorant Garamond', ${SERIF}`,
		title: `'Manrope', ${SANS}`,
		body: `'Manrope', ${SANS}`,
		mono: `'JetBrains Mono', ${MONO}`,
		label: `'JetBrains Mono', ${MONO}`,
	},
	softSerif: {
		googleFonts: [
			"Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..800",
			"Figtree:wght@300..800",
			"IBM Plex Mono:wght@400;500",
		],
		hero: `'Fraunces', ${SERIF}`,
		heading: `'Fraunces', ${SERIF}`,
		title: `'Figtree', ${SANS}`,
		body: `'Figtree', ${SANS}`,
		mono: `'IBM Plex Mono', ${MONO}`,
		label: `'Figtree', ${SANS}`,
	},
	expressive: {
		googleFonts: [
			"Bricolage Grotesque:opsz,wght@12..96,400..800",
			"Instrument Sans:wght@400..700",
			"JetBrains Mono:wght@400..600",
		],
		hero: `'Bricolage Grotesque', ${SANS}`,
		heading: `'Bricolage Grotesque', ${SANS}`,
		title: `'Bricolage Grotesque', ${SANS}`,
		body: `'Instrument Sans', ${SANS}`,
		mono: `'JetBrains Mono', ${MONO}`,
		label: `'Instrument Sans', ${SANS}`,
	},
} satisfies Record<string, FontPreset>;

// Change this to "editorial", "softSerif" or "expressive" to switch the whole site
export const ACTIVE_FONT_PRESET: keyof typeof FONT_PRESETS = "modern";
