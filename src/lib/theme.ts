import { useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

const hasChosenTheme = () => {
	try {
		return localStorage.getItem(STORAGE_KEY) !== null;
	} catch {
		return false;
	}
};

const storeTheme = (theme: Theme) => {
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		// Storage can be unavailable (private mode); theme still applies for this visit
	}
};

// The class on <html> is the source of truth: index.html sets it before React renders
const getTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
const getServerTheme = (): Theme => "dark";

const subscribe = (onChange: () => void) => {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
	return () => observer.disconnect();
};

const applyTheme = (theme: Theme) => document.documentElement.classList.toggle("dark", theme === "dark");

const updateThemeColor = () => {
	const background = getComputedStyle(document.documentElement).getPropertyValue("--c-bg-base").trim();
	document.querySelector('meta[name="theme-color"]')?.setAttribute("content", `rgb(${background})`);
};

/** Follows the system theme until the visitor picks one; only that choice is stored. */
export const useTheme = () => {
	const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

	useEffect(() => updateThemeColor(), [theme]);

	useEffect(() => {
		const media = window.matchMedia(LIGHT_QUERY);
		const followSystem = () => {
			if (!hasChosenTheme()) applyTheme(media.matches ? "light" : "dark");
		};
		media.addEventListener("change", followSystem);
		return () => media.removeEventListener("change", followSystem);
	}, []);

	const toggleTheme = () => {
		const next: Theme = theme === "dark" ? "light" : "dark";
		storeTheme(next);
		applyTheme(next);
	};

	return { theme, toggleTheme };
};
