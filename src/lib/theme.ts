import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

// index.html applies the initial class before React renders, so read it back from the DOM
const getInitialTheme = (): Theme =>
	document.documentElement.classList.contains("dark") ? "dark" : "light";

export const useTheme = () => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Storage can be unavailable (private mode); theme still applies for this visit
		}
	}, [theme]);

	const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

	return { theme, toggleTheme };
};
