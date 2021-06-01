export type LANGUAGE = 'en' | 'de' | 'fr' | 'it';
export type TranslateText = (key: string, defaultText?: string) => string;

/**
 * Generic type of object with properties 'en' & 'de' & 'it' & 'fr' and these properties are type of T
 */
export type TypeByLanguage<T = string> = {
  [key in LANGUAGE]: T;
};
