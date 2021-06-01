import { TRANSLATIONS } from './translations';
import { LANGUAGE, TranslateText } from './interfaces';
import { SUPPORTED_LANGUAGES } from './constants';

/**
 * Returns a translation function (usually used as "t")
 */
export const makeT = (currentLanguage: LANGUAGE): TranslateText =>
  (key: string, defaultText?: string) => TRANSLATIONS[key]?.[currentLanguage] ?? defaultText;

export const isLanguageSupported = (currentLanguage: string | undefined): currentLanguage is LANGUAGE => (
  currentLanguage ? SUPPORTED_LANGUAGES.includes(currentLanguage as any) : false
);
