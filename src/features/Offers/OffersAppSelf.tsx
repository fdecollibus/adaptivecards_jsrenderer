import { MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import { Body } from '@components/Body';
import { Container } from '@components/Grid';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { LoadingTile } from '@components/LoadingTile';
import { Page } from '@components/Page';
import { fetchJson } from '@core/Api';
import { useTranslation } from './hooks';
import { OffersCheckout } from '@features/Offers/OffersCheckout';
import * as Cookies from 'js-cookie';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import { COOKIE_EXPIRE_DAYS, COOKIE_NAME, ROUTE_PATH } from './constants';
import { getFlatOfferDetails, isOfferOpen } from './functions';
import { OfferConfirmation, OfferOverview } from './interfaces';
import { OfferDetailPage } from './OfferDetailPage';
import { OffersOverviewPage } from './OffersOverviewPage';
import { OffersResultPage } from './OffersResultPage';
import { OffersContext } from './OffersContext';
import { RegistrationContext } from './RegistrationContext';

type Props = {
  /* response from GET offers api call */
  offersOverview: OfferOverview;
  /* info if GET offers api call is loading data. to show loading indicator */
  getOffersLoading: boolean;
  /* fn to force reload of offers - GET */
  getOffers: () => void;
  children?: never;
};

/**
 * returns array of UUIDs which were stored in Cookies.
 * This array from Cookies is validated in this fn.
 * Only OPENED offers with isSelected flags are returned.
 */
const getPersistedSelectedOffersIds = (r: MyaxaRegistrationItem, offersOverview: OfferOverview): string[] => {
  const cookieOfferIds = (Cookies.get(COOKIE_NAME(r)) || '').split('|').filter(Boolean);
  return getFlatOfferDetails(offersOverview, cookieOfferIds)
    // isSelected flag is set using the 'cookieOfferIds'.
    // We need only selected offers so we filter them here
    .filter(offer => offer.isSelected)
    // and only opened offers can be selected, so we take only opened offers.
    .filter(isOfferOpen)
    .map(offer => offer.uuid);
};

const persistSelectedOffers = (selectedOffers: string[], r: MyaxaRegistrationItem): void => {
  Cookies.set(COOKIE_NAME(r), selectedOffers.join('|'), { expires: COOKIE_EXPIRE_DAYS });
};

/**
 * Receives the ready offersOverviewResponse; holds selectedOffers state
 */
export const OffersAppSelf: React.FC<Props> = ({ offersOverview, getOffersLoading, getOffers }) => {
  const offersContext = React.useContext(OffersContext);
  const registrationContext = React.useContext(RegistrationContext);
  const t = useTranslation();

  const [submitPending, setSubmitPending] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = React.useState<string | undefined>();

  /**
   * Array of selected offers uuids
   *
   * Preselected with the recommended && opened offers
   */
  let preSelectedOffersIds = getPersistedSelectedOffersIds(registrationContext, offersOverview);
  // if zero/none persisted selected offers, preselect the recommended offers
  if (preSelectedOffersIds.length === 0) {
    // only opened && recommended offers can be selected !
    preSelectedOffersIds = getFlatOfferDetails(offersOverview, [])
      .filter(o => o.recommendation)
      .filter(isOfferOpen)
      .map(o => o.uuid);
  }
  // warning: may contain now-invalid offers ids from the past
  const [selectedOffersIds, setSelectedOffersIds] = React.useState<string[]>(preSelectedOffersIds);
  const toggleSelected = (offerUuid: string) => {
    let newSelectedOffers = [];
    if (selectedOffersIds.includes(offerUuid)) {
      newSelectedOffers = selectedOffersIds.filter(so => so !== offerUuid); // filter out current selection
    } else {
      // remove uuids from same group, as each offer variant can be selected exclusively only within its group
      const excludeUuids = offersOverview.offerGroups.find(g => g.offers.some(o => o.uuid === offerUuid))?.offers.map(o => o.uuid) || [];
      newSelectedOffers = selectedOffersIds.filter(selectedUuid => !excludeUuids.includes(selectedUuid)).concat(offerUuid);
    }
    setSelectedOffersIds(newSelectedOffers);
    persistSelectedOffers(newSelectedOffers, registrationContext);
  };

  const clearSelected = () => setSelectedOffersIds([]);

  const selectOneOffer = (offerUuid: string) => {
    setSelectedOffersIds([offerUuid]);
  };

  const submitOffers = async () => {
    // set local state on init
    setSubmitPending(true);
    setSubmitError(false);

    try {
      // submit selected offers via POST api call
      const postOffers = await fetchJson<OfferConfirmation>({
        apiBaseUrl: offersContext.apiBaseUrl,
        endpoint: `/rest/po/partner/v1/partners/${registrationContext.partnerNo}/offers`,
        method: 'POST',
        language: offersContext.language,
        payload: getFlatOfferDetails(offersOverview, selectedOffersIds).filter(offer => offer.isSelected),
        token: offersContext.token,
      });
      if (postOffers.emailCustomer) {
        setCustomerEmail(postOffers.emailCustomer);
      }
      // get current offers overview from BE
      getOffers();
      // turn off loading bar
      setSubmitPending(false);
      // clear selected offers from local state
      clearSelected();
    } catch (e) {
      // when error, set local error state
      setSubmitError(true);
      // turn off loading bar
      setSubmitPending(false);
    }
  };

  return (
    <Body>
      <Switch>
        <Route path={ROUTE_PATH.OFFER_DETAIL} exact>
          <OfferDetailPage
            offersOverview={offersOverview}
            selectedOffersIds={selectedOffersIds}
            toggleSelected={toggleSelected}
            selectOneOffer={selectOneOffer}
          />
        </Route>
        <Route path={ROUTE_PATH.CHECKOUT} exact>
          <LoadingSpinner isLoading={submitPending}>
            <OffersCheckout
              offersOverview={offersOverview}
              selectedOffersIds={selectedOffersIds}
              submitOffers={submitOffers}
              toggleSelected={toggleSelected}
            />
          </LoadingSpinner>
        </Route>
        <Route path={ROUTE_PATH.CONFIRMATION} exact>
          {submitPending ? (
            <Page>
              <Container>
                <LoadingTile title={t('Offers.offersOrder.Title')}/>
              </Container>
            </Page>
          ) : (
            <OffersResultPage
              error={submitError}
              email={customerEmail}
            />
          )}
        </Route>
        <Route path={ROUTE_PATH.OFFERS_OVERVIEW}>
          <LoadingSpinner isLoading={getOffersLoading}>
            <OffersOverviewPage
              offersOverview={offersOverview}
              selectedOffersIds={selectedOffersIds}
              toggleSelected={toggleSelected}
            />
          </LoadingSpinner>
        </Route>
      </Switch>
    </Body>
  );
};
