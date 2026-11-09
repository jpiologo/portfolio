import { type ReactNode, useEffect, useState } from "react";
import { type Region, useVisitorRegion } from "../lib/region";
import { I18nContext, type Language, MESSAGES } from "./context";

const STORAGE_KEY = "language";

const languageForRegion = (region: Region): Language => (region === "BR" ? "pt" : "en");

const readStoredLanguage = (): Language | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored === "en" || stored === "pt" ? stored : null;
	} catch {
		return null;
	}
};

const guessFromBrowser = (): Language => (navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");

/*
 * The visitor's country (CF-IPCountry / Vercel geo header) decides the language. Until that lookup
 * answers, the last detected language (or the browser language on a first visit) is shown, so most
 * visitors never see the page switch languages.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const region = useVisitorRegion();
	const [language, setLanguage] = useState<Language>(() => readStoredLanguage() ?? guessFromBrowser());

	useEffect(() => {
		if (region) setLanguage(languageForRegion(region));
	}, [region]);

	useEffect(() => {
		document.documentElement.lang = MESSAGES[language].htmlLang;
		try {
			localStorage.setItem(STORAGE_KEY, language);
		} catch {
			// Storage can be unavailable (private mode); the language still applies for this visit
		}
	}, [language]);

	return <I18nContext.Provider value={MESSAGES[language]}>{children}</I18nContext.Provider>;
};
