import fs from 'fs';

/**
 * This utility was created to generate file with translations (as const) from file 'raw-translations.txt'
 *
 * To update or add new translations:
 * 1. Open Textel file and copy all offers rows.
 * 2. Paste these rows into raw-translations.txt file
 * 3. Run script: npm run translations
 * 4. Check git diff, test offers app and commit new files to repo.
 */

// helper type. raw-translations are modified to this structure during process
type TranslationItem = {
  de: string,
  fr: string,
  it: string,
  en: string,
  key: string,
  modifier: string,
};

// IDs of columns in Textel file
const COLS = {
  TEXT_DE: 1,
  TEXT_FR: 2,
  TEXT_IT: 3,
  TEXT_EN: 4,
  KEY: 6,
};

// this variable contains content of our output file
let output = `// DO NOT MODIFY THIS FILE !!
// THIS FILE IS GENERATED BY './utils/translations/' DURING 'npm run translations'
import { TypeByLanguage } from './interfaces';

export const TRANSLATIONS: { [key: string]: TypeByLanguage<string> } = {
`;

// helper fn to parse key and modifier from 'KEY' column.
// input looks like this "pt:offersAmountMonth:label" -> "pt:<key>:<modifier>"
const parseKey = (key: string | undefined): { key?: string, modifier?: string } => {
  const parsedKeyArr = key?.split(':');
  return {
    key: parsedKeyArr?.[1] ?? undefined,
    modifier: parsedKeyArr?.[2] ?? undefined,
  };
};

const replaceSpecialCharacters = (text: string | undefined): string => {
  if (!text) return '';

  return text
    .replace(/\\\\/g, '\\n') // map new line char
    .replace(/'/g, '\\\'') // escape ' char
    // map ** to <b> tag
    .replace(/\*\*[\\\{\}a-zA-Z\s\.\d]*\*\*/g, (match) => {
      return `<b>${match.substr(2, match.length - 4)}</b>`;
    })
    // map link to <a> tag
    .replace(/\[\[[a-zA-Z:\/?&=\d\.]*\|[a-zA-z\s\d]*\]\]/g, (match) => {
      const parsedMatch = match.replace('[[', '').replace(']]', '').split('|');
      return `<a href="${parsedMatch[0]}" target="_blank">${parsedMatch[1]}</a>`;
    });
};

// in this function we read, process and output new file with translations
const processTranslations = async () => {
  // read input file
  fs.readFile('utils/translations/raw-translations.txt', 'utf8', (err, data) => {
    if (err) {
      // @ts-ignore
      console.error('Error read file:', err);
    }
    // process input data - split to rows, then split data in rows to 'cells' level, then process
    const translationItems: TranslationItem[] =
      data.split('\n')
        .map((row) => {
          const splittedRow = row.split('\t');
          const parsedKey = parseKey(splittedRow[COLS.KEY]);
          return {
            key: parsedKey.key ?? 'skipThisRow', // last row is always undefined - later we filter this out
            modifier: parsedKey.modifier ?? 'skipThisRow',
            de: `'${replaceSpecialCharacters(splittedRow[COLS.TEXT_DE])}',`,
            fr: splittedRow[COLS.TEXT_FR] === ''
              ? `'<<${replaceSpecialCharacters(splittedRow[COLS.TEXT_DE])}>>', // todo: missing translation`
              : `'${replaceSpecialCharacters(splittedRow[COLS.TEXT_FR])}',`,
            it: splittedRow[COLS.TEXT_IT] === ''
              ? `'<<${replaceSpecialCharacters(splittedRow[COLS.TEXT_DE])}>>', // todo: missing translation`
              : `'${replaceSpecialCharacters(splittedRow[COLS.TEXT_IT])}',`,
            en: splittedRow[COLS.TEXT_EN] === ''
              ? `'<<${replaceSpecialCharacters(splittedRow[COLS.TEXT_DE])}>>', // todo: missing translation`
              : `'${replaceSpecialCharacters(splittedRow[COLS.TEXT_EN])}',`,
          };
        })
        .filter(item => item.key !== 'skipThisRow'); // filter rows which were undefined

    // write everything to output variable (spaces are important because of final file formatting)
    translationItems.forEach((item, index) => {
      output += `  'Offers.${item.key}.${item.modifier}': {
    de: ${item.de}
    fr: ${item.fr}
    it: ${item.it}
    en: ${item.en}
  },
`;
    });

    output += `};
`;

    fs.writeFile('src/core/Intl/translations.ts', output, (writeErr) => {
      if (writeErr) {
        console.error('WRITE ERROR', writeErr);
        return;
      }
      //file written successfully
      console.log('DONE.');
      return;
    });
  });
};

processTranslations();
