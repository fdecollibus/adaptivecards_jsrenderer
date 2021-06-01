import { MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import { IconType } from '@components/Icon';

/**
 * Offer.status.key options
 */
export const OFFER_STATUS_KEY = {
  OPEN: '0', // Offen
  ORDERED: '1', // Versicherung bestellt
  ACTIVE: '2', // Versicherung aktiv
};

/**
 * Name of cookie that stores |-separated list of selected offers uuids
 *
 * Unique name per registration, example: myaxa-offers_selected_1001234-0000-0000-0000-000000000000
 */
export const COOKIE_NAME = (r: MyaxaRegistrationItem) => `myaxa-offers_selected_${r.key}`;

/**
 * Expire time of COOKIE_NAME in days
 */
export const COOKIE_EXPIRE_DAYS = 7;

export const fallbackProductIcon: IconType = 'more_horiz';

/**
 * A complete list of ProductIcons corresponding IDs and values in excel and BE
 * (@see Confluence => BR-2009-MYAXA Produkte: Farbe & Kategorie Vertragskacheln)
 */
export const ProductIcon = new Map<number, IconType>([
  [0, fallbackProductIcon],
  [1, 'salooncar'],
  [2, 'building'],
  [3, 'construction'],
  [4, 'credit'],
  [5, 'epidemic'],
  [6, 'fire-house'],
  [7, 'gear'],
  [8, 'goods-transport'],
  [9, 'computer-secure'],
  [10, 'keys'],
  [11, 'hospital'],
  [12, 'legal'],
  [13, 'liability'],
  [14, 'mobile'],
  [15, 'plane'],
  [16, 'rocking-chair'],
  [17, 'sail-boat'],
  [18, 'site-foreman'],
  [19, 'household_move'],
  [20, 'valuables'],
  [21, 'global'],
  [22, 'ambulance'],
  [23, 'streaming'],
  [24, 'hand-heart'],
  [25, 'hand-leaf'],
  [26, 'safe'],
  [27, 'broken-glass'],
  [28, 'coins-chf'],
  [29, 'couch'],
]);

/**
 * Inputs for <Route path="...">
 *
 * May contain placeholders (:offerUuid)
 */
export const ROUTE_PATH = {
  OFFERS_OVERVIEW: '/',
  CHECKOUT: '/checkout',
  OFFER_DETAIL: '/offer/:offerUuid',
  CONFIRMATION: '/confirmation',
};

/**
 * Inputs for history.push(...)
 *
 * May contain functions (offerUuid: string)=>string
 */
export const HISTORY_PATH = {
  ...ROUTE_PATH,
  OFFER_DETAIL: (offerUuid: string) => ROUTE_PATH.OFFER_DETAIL.replace(':offerUuid', offerUuid),
};
