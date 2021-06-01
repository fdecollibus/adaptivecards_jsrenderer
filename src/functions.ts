import cx from "classnames";

/**
 * Functions
 *
 * (if it grows, file can be moved to ./src/functions/index.ts later)
 */

/**
 * Cleans-up unwanted IE11/EDGE trash from local date string
 *
 * Removes UTF-8 text-direction characters created by IE11/EDGE Date.toLocaleDateString/Intl.DateTimeFormat().format();
 *
 * https://www.csgpro.com/blog/2016/08/a-bad-date-with-internet-explorer-11-trouble-with-new-unicode-characters-in-javascript-date-strings/
 */
export const sanitizeLocalDate = (localDate: string): string =>
  localDate.replace(/[^0-9\.\/-]/g, "");

/**
 * if no time and timezone specified, add T00:00:00, so that Date.parse() treats this string as local date (instead of UTC)
 *
 * eg. 1903-02-01 -> 1903-02-01T00:00:00
 *
 * @param date as string
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
 */
export const addTimeToDateString = (date: string) => {
  let formattedDate = date;
  // if matches exactly the pattern 2020-05-20 add T00:00:00 to treat date as local (and not UTC)
  if (formattedDate?.match(/^\d{4}-\d{2}-\d{2}$/)) {
    formattedDate = formattedDate + "T00:00:00";
  }
  return formattedDate;
};

/**
 * Converts date string into 'de-CH' locale date (05.01.1980). If timezone info is present, then converts to Europe/Zurich time zone.
 *
 *  "2017-11-24T15:00:48Z" => "24.11.2017"
 *  "1980-01-04T23:00:00Z" => "05.01.1980"
 *  "1980-01-04" => "04.01.1980"
 */
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return ""; // better then "Invalid Date" if dateString would be is empty string
  }

  // dateString on input HAS to begin in YYYY-MM-DD format and may contain minutes/timezone: see function doc block
  const dateStringMatchArray = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

  // do no formatting when unsupported format supplied
  if (!dateStringMatchArray) {
    return dateString;
  }

  const containsTimezone = /(Z|GMT|UTC|\+)/.test(dateString);

  // if doesn't contain timezone info, process manually -- without using Date, due to suspicious BUGs, see:
  // https://jira.axa.com/jira/browse/MYAXATA-8971
  if (!containsTimezone) {
    return `${dateStringMatchArray[3]}.${dateStringMatchArray[2]}.${dateStringMatchArray[1]}`;
  }

  // otherwise contains timezone, so process with Date to convert to 'Europe/Zurich' TZ (example: contract sign date)

  const date = new Date(dateString);
  const locale = "de-CH";

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zurich",
  };

  let result = "";
  try {
    result = date.toLocaleDateString(locale, options);
  } catch (e) {
    // fallback support for IE11 which doesn't support named timezones...
    const OFFSET_EUROPE_ZURICH_TO_UTC = 2; // offset to UTC -> do we need to handle DST?
    // create new local date with time from Europe/Zurich
    result = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + OFFSET_EUROPE_ZURICH_TO_UTC,
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    ).toLocaleDateString(locale, omitKey("timeZone", options));
  }

  return sanitizeLocalDate(result);
};

/**
 * @param value - amount
 * @param currency - default is 'CHF'
 * @param fractionDigits - default is 2
 * @param thousands - delimiter, default is '
 * @param escape - if value is missing use this, default is -
 */
export const formatCurrency = (
  value: number | null | string | undefined,
  currency: string = "CHF",
  fractionDigits: number = 2,
  thousands: string = "’",
  escape: string = "-"
) => {
  let amount = value;
  if (amount === undefined || amount === null) {
    return escape; // better then "Invalid Date" if apiDate would be is empty string
  }
  if (typeof amount === "string") {
    amount = parseFloat(amount);
    if (isNaN(amount)) return escape;
  }
  return `${currency} ${amount
    .toFixed(fractionDigits)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousands)}`;
};

/**
 * Same as formatCurrency() plus strips trailing ".00"
 */
export const formatCurrencyNoZeroCents = (
  value: number | null | string | undefined,
  currency: string = "CHF",
  fractionDigits: number = 2,
  thousands: string = "’",
  escape: string = "-"
) => {
  return formatCurrency(
    value,
    currency,
    fractionDigits,
    thousands,
    escape
  ).replace(/\.00$/, "");
};

/** input values is decimal number e.g. 0.55 and output from fn is 55% */
export const formatPercentage = (
  value: number | null,
  decimals: number = 0,
  escape: string = "-"
) => {
  if (value === null || value === undefined) {
    return escape;
  }
  return `${(value * 100).toFixed(decimals)}%`;
};
/**
 * Returns string in ISO (API) format: 2019-06-24T13:14:15.000Z
 *
 * For input: apiDate(2019, 6, 24, 13, 14, 15)
 *
 * And Works now in IE11 too!
 *
 * @link https://www.w3schools.com/js/js_dates.asp
 * @link https://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
 */
export const isoDate = (
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
) => {
  return new Date(year, month - 1, day, hour, minute, second).toISOString();
};

/**
 * Returns a date in YYYY-MM-DD format
 *
 * @param dateStr date in Date.toString() format (format parseable by new Date())
 */
export const YYYYMMDDDate = (dateStr: string) => {
  const d = new Date(addTimeToDateString(dateStr));
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

/**
 * Helper for exhaustive switch/case checks
 *
 * https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
 * https://dev.to/babak/exhaustive-type-checking-with-typescript-4l3f
 */
export const exhaustiveCheck = (param: never) => {
  // silently ignore
};

export const getQueryParamsString = (
  params: Record<string, string | number | null | undefined>
) => {
  // don't allow object value
  const query = Object.keys(params)
    .filter((k) => !!params[k])
    .map(
      (k) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          params[k] as string | number
        )}`
    )
    .join("&");
  return query.length > 0 ? `?${query}` : "";
};

export const generateRandomKey = () =>
  Math.floor(Math.random() * 100000000 + 1).toString();

/**
 * Returns true if `process.env.NODE_ENV !== 'development'`
 */
export const isProductionBuild = () => process.env.NODE_ENV !== "development";

/**
 * Scrolls viewport to the given `elementId`
 *
 * On DEV env, displays error on console, if `elementId` was not found.
 */
export const scrollToElementId = (elementId: string) => {
  const targetElement = document.getElementById(elementId);

  if (!targetElement) {
    if (!isProductionBuild()) {
      console.error(
        "scrollToElementId() target element not found: #" + elementId
      ); // tslint:disable-line:no-console
    }
    return;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  targetElement.scrollIntoView({ behavior: "smooth" });
};

/**
 * function returns translation key as string for translateText fn.
 * used for field validations in Forms
 */
export const getValidationMessageKey = (errorMsgKey: string) =>
  `kundenportal.api.ValidationErrMsg.${errorMsgKey}.text.label`;

/**
 * ref to myaxa-web: GrefRefnrFilter
 * purpose: format accessContractNo
 */
export const formatAccessContractNo = (accessContractNo?: number) => {
  return !accessContractNo
    ? "-"
    : accessContractNo
        .toString()
        .replace(/([0-9]{1,3})([0-9]{3})([0-9]{3})/, "$1.$2.$3");
};

/** if bifrostConfig is available in window object, we are sure that app is running as POD */
export const isPOD = (): boolean => !!(window as any).bifrostConfig;

/** prefix string. if string is already prefixed or empty string, return unchanged string */
export const prefixString = (text: string, prefix: string): string =>
  text.startsWith(prefix) || text === "" ? text : `${prefix}${text}`;

type ClassValue = string | undefined | null;

const CLASSNAME_PREFIX = "myaxapod__";

/** this is required for every class */
export const prefixClass = (...classes: ClassValue[]): string =>
  cx(classes)
    .split(" ")
    .map((classname) => prefixString(classname, CLASSNAME_PREFIX))
    .join(" ");

/**
 * Deep merges target object with source object; does not mutate target object
 *
 * Doesn't handle Maps, Sets, cyclic references.
 *
 * Alternative for _.merge(); because we don't want that dependency.
 *
 * Inspirations taken from:
 * @link https://jonlabelle.com/snippets/view/javascript/recursively-merge-two-or-more-objects-in-javascript
 * @link https://stackoverflow.com/a/40294058
 */
export const deepMerge = <
  T extends Record<string, any>,
  S extends Record<string, any>
>(
  target: T,
  source: S
): T & S => {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        if (Array.isArray(source[key])) {
          result[key] = source[key].slice(0);
        } else if ((source[key] as any) instanceof RegExp) {
          result[key] = new RegExp(
            source[key].source,
            source[key].flags
          ) as any;
        } else if ((source[key] as any) instanceof Date) {
          result[key] = new Date(source[key]) as any;
        } else {
          // object:
          result[key] = deepMerge(result[key], source[key]);
        }
      } else {
        // not object:
        (result[key] as any) = source[key];
      }
    }
  }
  return result as T & S;
};

/**
 * ES6 native alternative to _.omit; one key only
 *
 * @link https://levelup.gitconnected.com/omit-is-being-removed-in-lodash-5-c1db1de61eaf
 */
export const omitKey = <T, K extends keyof T>(
  keyToOmit: K,
  { [keyToOmit]: _, ...omittedKeyObj }: T = {} as T
): Omit<T, K> => omittedKeyObj;

/**
 * ES6 native alternative to _.isEmpty
 */
export const isEmpty = (arg: object | any[] | null | undefined): boolean => {
  if (!arg) {
    return true;
  }
  if (Array.isArray(arg)) {
    return arg.length === 0;
  }
  return Object.keys(arg).length === 0;
};

/**
 * ES6 native alternative to _.uniq; crates new array; simple values only;
 *
 * @link https://codeburst.io/javascript-array-distinct-5edc93501dc4
 */
export const uniq = <T = number | string>(arr: T[]): T[] => [...new Set(arr)];

/**
 * Native alternative to _.capitalize
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Object.fromEntries ponyfill for our beloved IE11
 *
 * (I was unable to setup core-js@2 to polyfill this; and we should not use corej-js@3 because of AEM)
 *
 * @link https://github.com/feross/fromentries/blob/master/index.js
 */
export const objectFromEntries = <T = any>(
  entries: Iterable<readonly [string, T]>
): { [k: string]: T } => {
  return [...entries].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {} as { [k: string]: T });
};

export const removeItemFromArray = <T>(array: T[], valueToRemove: T) => {
  const newArray = [...array];
  const indexOfValue = newArray.indexOf(valueToRemove);
  return indexOfValue > -1 ? newArray.splice(indexOfValue, 1) : newArray;
};
