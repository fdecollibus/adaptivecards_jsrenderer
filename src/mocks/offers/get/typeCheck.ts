/**
 * Type check json data
 */
import { OfferOverview } from '@features/Offers';
import offers from './data.json';
import offersBff from './data-bff.json';

const typeCheckOffers = (a: OfferOverview) => null;
typeCheckOffers(offers);
typeCheckOffers(offersBff);
