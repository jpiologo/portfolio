import type { Language } from "./language";

/*
 * The URL decides the language: English at the root, Portuguese under /pt.
 * index.html repeats the prefix and the storage keys to redirect before React loads.
 */
const PT_PREFIX = "/pt";
const LANGUAGE_KEY = "language";
const CHOSEN_BY_VISITOR_KEY = "languageChosenByVisitor";

/** Optional prefix for React Router paths, so one route serves both languages. */
export const LANGUAGE_SEGMENT = `${PT_PREFIX}?`;

export const languageFromPath = (pathname: string): Language =>
	pathname === PT_PREFIX || pathname.startsWith(`${PT_PREFIX}/`) ? "pt" : "en";

/** The path as it would be in English, which is also how links are written in the code. */
export const stripLanguage = (pathname: string) =>
	languageFromPath(pathname) === "pt" ? pathname.slice(PT_PREFIX.length) || "/" : pathname;

/** Takes a path written for English ("/blog", "/#about") to the given language. */
export const localizePath = (path: string, language: Language) => {
	if (language === "en") return path;
	const isHome = path === "/" || path.startsWith("/#");
	return PT_PREFIX + (isHome ? path.slice(1) : path);
};

/** The choice made in the header wins over the browser language on the next visits. */
export const rememberLanguage = (language: Language) => {
	try {
		localStorage.setItem(LANGUAGE_KEY, language);
		localStorage.setItem(CHOSEN_BY_VISITOR_KEY, "true");
	} catch {
		// Storage can be unavailable (private mode); the URL still holds the language for this visit
	}
};
