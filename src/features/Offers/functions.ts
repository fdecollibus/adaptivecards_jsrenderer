import { getAdvisorFullName } from './AdvisorTile';
import { fallbackProductIcon, OFFER_STATUS_KEY, ProductIcon } from './constants';
import { Advisor, Offer, OfferDetail, OfferOverview } from './interfaces';

/** helper fn to get name of advisor that recommended offer */
export const getAdvisorNameForRecommendation = (isOfferRecommended: boolean, advisor: Advisor | undefined | null) => (
  isOfferRecommended ? getAdvisorFullName(advisor) : undefined
);

/** helper fn to check if some uuid is selected */
export const isOfferSelected = (selectedUuids: string[], uuid: string): boolean => selectedUuids.includes(uuid);

/**
 * Returns true if offer is open for booking (not in processing state, not in closed state)
 */
export const isOfferOpen = (offer: Offer): boolean => offer.state.key === OFFER_STATUS_KEY.OPEN;

/**
 * return corresponding translation id for state key
 * needs to be put it t()
 */
export const getStateTranslationId = (stateKey: string): string => {
  switch (stateKey) {
    case OFFER_STATUS_KEY.ORDERED: // state key 1
      return 'Offers.offersOverviewOfferStateOrdered.label';
    case OFFER_STATUS_KEY.ACTIVE: // state key 2
      return 'Offers.offersOverviewOfferStateActive.label';
    default:
      return '';
  }
};

/**
 * map offerOverview response object to flat array of our frontend OfferDetail type - it contains isSelected flag and product information
 *
 * response + selected array -> flat array of OfferDetail
 */
export const getFlatOfferDetails = (offerOverview: OfferOverview, selectedOffersArr: string[]): OfferDetail[] => {
  const res: OfferDetail[] = [];
  if (offerOverview) {
    offerOverview.offerGroups.forEach((group) => {
      group.offers.forEach((offer) => {
        res.push({
          ...offer,
          isSelected: isOfferSelected(selectedOffersArr, offer.uuid),
          icon: ProductIcon.get(offer.iconId || 0) ?? fallbackProductIcon,
          formattedTitle: [offer.productName, offer.descriptionOfferGroup].filter(Boolean).join(', '),
        });
      });
    });
  }
  return res;
};

/** returns OfferDetail object identified by uuid */
export const getSingleOfferDetail = (offerDetails: OfferDetail[], uuid: string): OfferDetail | undefined => {
  return offerDetails.find(offer => offer.uuid === uuid);
};

// export OfferDetail array => total amount number
export const getTotalAmountOfSelectedOffers = (offerDetails: OfferDetail[]): number => {
  return offerDetails
    .filter(offer => offer.isSelected)
    .map(offer => offer.premium.amount)
    .reduce((prev, curr) => (prev + curr), 0);
};

/**
 * Whether the offerOverview "has offers" (so we have something to show; may it be already ordered offers only)
 *
 * When false then a "Keine Offerten verfugbar" page will be shown.
 */
export const hasOffers = (offerOverview: OfferOverview): boolean => offerOverview.offerGroups.length > 0;
