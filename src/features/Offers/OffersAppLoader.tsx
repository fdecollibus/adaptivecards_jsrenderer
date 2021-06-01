import { Body } from '@components/Body';
import { Container } from '@components/Grid';
import { ErrorTile } from '@components/ErrorTile';
import { Loader } from '@components/Loader';
import { hasOffers } from './functions';
import { useTranslation } from './hooks';
import { Page } from '@components/Page';
import { fetchJson } from '@core/Api';
import * as React from 'react';
import { OfferOverview } from './interfaces';
import { NoOffersPage } from './NoOffersPage';
import { OffersAppSelf } from './OffersAppSelf';
import { OffersContext } from './OffersContext';
import { RegistrationContext } from './RegistrationContext';

type Props = {
  children?: never;
};

/**
 * Loads and holds offersOverview
 *
 * Displays Loading indicator and Error page.
 *
 * Once loaded, displays OffersAppSelf
 */
export const OffersAppLoader: React.FC<Props> = () => {

  const offersContext = React.useContext(OffersContext);
  const registrationContext = React.useContext(RegistrationContext);
  const t = useTranslation();
  const registrationRef = React.useRef(registrationContext); // to eval current registrationContext in async fn

  // response from GET offers is stored in this local state
  const [offersOverview, setOffersOverview] = React.useState<OfferOverview>();
  // info if GET offers api is loading
  const [offersOverviewLoading, setOffersOverviewLoading] = React.useState<boolean>(false);
  // error message if GET offers api fails
  const [offersOverviewError, setOffersOverviewError] = React.useState<string>();

  // fn to handle GET offers api call
  const getOffersIfToken = async () => {
    if (offersContext.token) {
      try {
        setOffersOverviewLoading(true);
        // reset error if we start new api call
        if (offersOverviewError) {
          setOffersOverviewError(undefined);
        }
        const response = await fetchJson<OfferOverview>({
          apiBaseUrl: offersContext.apiBaseUrl,
          endpoint: `/rest/po/partner/v1/partners/${registrationContext.partnerNo}/offers`,
          language: offersContext.language,
          token: offersContext.token,
        });
        // if registrationContext is still current
        if (registrationContext.key === registrationRef.current.key) {
          setOffersOverview(response);
          setOffersOverviewLoading(false);
        }
      } catch (e) {
        setOffersOverviewError(e);
        setOffersOverviewLoading(false);
      }
    }
  };

  // get offers on init, when token is available, when registration changes
  React.useEffect(
    () => {
      registrationRef.current = registrationContext;
      getOffersIfToken();
    },
    [offersContext.token, registrationContext.key],
  );

  // do not do anything else, if there is offersOverviewError
  if (offersOverviewError) {
    return (
      <Body>
        <Page>
          <Container>
            <ErrorTile
              title={t('Offers.offersGetOffersErrorMsg.title')}
              message={t('Offers.offersGetOffersErrorMsg.label')}
            />
          </Container>
        </Page>
      </Body>
    );
  }

  // do not do anything else, when no offersOverviewResponse, or  loading with no offers (bypass loading + have offers)
  if (!offersOverview || (offersOverviewLoading && !hasOffers(offersOverview))) {
    return (
      <Loader title={t('Offers.offersOverview.title')}/>
    );
  }

  // NoOffersPage when there are no offers
  if (!hasOffers(offersOverview)) {
    return (
      <Body>
        <NoOffersPage partnerNo={registrationContext.partnerNo}/>
      </Body>
    );
  }

  return (
    <OffersAppSelf
      offersOverview={offersOverview}
      getOffers={getOffersIfToken}
      getOffersLoading={offersOverviewLoading}
    />
  );
};
