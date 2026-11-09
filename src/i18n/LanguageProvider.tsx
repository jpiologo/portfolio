import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { type Region, useVisitorRegion } from "../lib/region";
import { I18nContext, type Language, LanguageControlContext, MESSAGES } from "./context";

// index.html reads LANGUAGE_KEY before React loads to set <html lang> early
const LANGUAGE_KEY = "language";
const CHOSEN_BY_VISITOR_KEY = "languageChosenByVisitor";

const languageForRegion = (region: Region): Language => (region === "BR" ? "pt" : "en");

const readStorage = (key: string) => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};

const writeStorage = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage can be unavailable (private mode); the language still applies for this visit
	}
};

const readStoredLanguage = (): Language | null => {
	const stored = readStorage(LANGUAGE_KEY);
	return stored === "en" || stored === "pt" ? stored : null;
};

const guessFromBrowser = (): Language => (navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");

/*
 * The visitor's country (CF-IPCountry / Vercel geo header) decides the language, unless the visitor
 * picked one in the header switcher, which then sticks. Until the country lookup answers, the last
 * language (or the browser language on a first visit) is shown, so most visitors never see it switch.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const region = useVisitorRegion();
	const [language, setLanguage] = useState<Language>(() => readStoredLanguage() ?? guessFromBrowser());

	useEffect(() => {
		if (region && readStorage(CHOSEN_BY_VISITOR_KEY) !== "true") setLanguage(languageForRegion(region));
	}, [region]);

	useEffect(() => {
		document.documentElement.lang = MESSAGES[language].htmlLang;
		writeStorage(LANGUAGE_KEY, language);
	}, [language]);

	const chooseLanguage = useCallback((chosen: Language) => {
		writeStorage(CHOSEN_BY_VISITOR_KEY, "true");
		setLanguage(chosen);
	}, []);

	const control = useMemo(() => ({ language, chooseLanguage }), [language, chooseLanguage]);

	return (
		<LanguageControlContext.Provider value={control}>
			<I18nContext.Provider value={MESSAGES[language]}>{children}</I18nContext.Provider>
		</LanguageControlContext.Provider>
	);
};
