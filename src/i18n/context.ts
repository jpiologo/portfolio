import { createContext, useContext } from "react";
import { en, type Messages } from "./en";
import type { Language } from "./language";
import { pt } from "./pt";

export type { Language };

export const MESSAGES: Record<Language, Messages> = { en, pt };

export const I18nContext = createContext<Messages>(en);

export const useI18n = () => useContext(I18nContext);

type LanguageControl = { language: Language; chooseLanguage: (language: Language) => void };

export const LanguageControlContext = createContext<LanguageControl>({
	language: "en",
	chooseLanguage: () => {},
});

/** For the language switcher: the visitor's choice wins over the country-based detection. */
export const useLanguageControl = () => useContext(LanguageControlContext);
