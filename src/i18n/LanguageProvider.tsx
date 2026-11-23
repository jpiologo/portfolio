import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { I18nContext, MESSAGES } from "./context";
import { languageFromPath } from "./routes";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const messages = MESSAGES[languageFromPath(useLocation().pathname)];

	useEffect(() => {
		document.documentElement.lang = messages.htmlLang;
	}, [messages]);

	return <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>;
};
