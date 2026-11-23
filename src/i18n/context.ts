import { createContext, useContext } from "react";
import { en, type Messages } from "./en";
import type { Language } from "./language";
import { pt } from "./pt";

export type { Language };

export const MESSAGES: Record<Language, Messages> = { en, pt };

export const I18nContext = createContext<Messages>(en);

export const useI18n = () => useContext(I18nContext);
