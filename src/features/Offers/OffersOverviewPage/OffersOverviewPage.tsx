import AssignmentIndIcon from '@axa-ch/materials/icons/assignment_ind.svg.js';
import Arrow from '@axa-ch/materials/icons/keyboard_arrow_left.svg.js';
import { Alert } from '@components/Alert';
import { Container } from '@components/Grid';
import { Heading } from '@components/Heading';
import { Icon } from '@components/Icon';
import { Link } from '@components/Link';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { Page } from '@components/Page';
import { Spacer } from '@components/Spacer';
import { Tile, TileOffset } from '@components/Tile';
import { Typo } from '@components/Typo';
import { navigateToFileByDokIdEcm } from '../downloadFunctions';
import { OffersContext } from '../OffersContext';
import * as React from 'react';
import { ADVISOR_TILE_ANCHOR_ID, AdvisorTile, scrollToAdvisorTile } from '../AdvisorTile';
import { CartButton } from '../CartButton';
import { fallbackProductIcon, HISTORY_PATH, ProductIcon } from '../constants';
import {
  getAdvisorNameForRecommendation,
  getFlatOfferDetails,
  getTotalAmountOfSelectedOffers,
  isOfferOpen,
  isOfferSelected,
} from '../functions';
import { useBackUrlToMyAxa, useTranslation } from '../hooks';
import { OfferOverview } from '../interfaces';
import { OfferRow } from '../OfferRow';
import { Total } from '../Total';
import './OffersOverviewPage.scss';

export type OffersOverviewPageType = {
  /** raw data = response from offers api call */
  offersOverview: OfferOverview;
  /** array of selected offers uuids */
  selectedOffersIds: string[],
  /** fn to toggle selected state for specific offer */
  toggleSelected: (offerUuid: string) => void,
  children?: never;
};

/**
 * OffersOverview page template (list of all offers)
 */
export const OffersOverviewPage: React.FC<OffersOverviewPageType> = (props) => {
  const offersContextConsumer = React.useContext(OffersContext);
  const t = useTranslation();
  const backUrlToMyAxa = useBackUrlToMyAxa();

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [errorLngKey, setErrorLngKey] = React.useState<string>(); // a download error message lng key; message displayed in an Alert

  const offerDetails = getFlatOfferDetails(props.offersOverview, props.selectedOffersIds);
  const bookedOffers = offerDetails.filter(o => !isOfferOpen(o));
  // filter out offerGroups without open offers
  const offerGroupsWithOpenOffers = props.offersOverview.offerGroups.filter(og => og.offers.some(o => isOfferOpen(o)));

  const downloadHandlers = { setErrorLngKey, setLoading };

  // for Offer document from Documents API
  const downloadByEcmDocId = (ecmDocId: string) => {
    if (offersContextConsumer.token) { // TS
      navigateToFileByDokIdEcm(
        ecmDocId,
        offersContextConsumer.language,
        offersContextConsumer.apiBaseUrl,
        offersContextConsumer.token,
        downloadHandlers,
      );
    }
  };

  return (
    <Page>
      <Container>
        <div className={'OffersOverviewPage__Links'}>
          <Link
            icon={Arrow}
            variant={'icon'}
            href={backUrlToMyAxa}
          >
            {t('Offers.offersBackToMyaxaLink.label')}
          </Link>

          {
            !!props.offersOverview.advisor && (
              <Link
                icon={AssignmentIndIcon}
                variant={'icon'}
                onClick={scrollToAdvisorTile}
              >
                {t('Offers.offersOverviewShowAgentInfo.label')}
              </Link>
            )
          }
        </div>

        <LoadingSpinner backdrop isLoading={isLoading}>
          <Tile
            title={t('Offers.offersOverview.title')}
          >
            <TileOffset bottomSpacing>
              <Typo size={'t2'}>
                {t('Offers.offersOverviewInfo.label')}
              </Typo>

              {(props.selectedOffersIds.length > 0) && (
                <div className={'OffersOverviewPage__TopButtonWrapper'}>
                  <CartButton
                    itemsCount={props.selectedOffersIds.length}
                  />
                  <Total
                    label={t('Offers.offersOverviewTotal.label')}
                    amount={getTotalAmountOfSelectedOffers(offerDetails)}
                  />
                </div>
              )}

              {errorLngKey && (
                <>
                  <Spacer/>
                  <Alert
                    type="error"
                    animate
                  >
                    {t(errorLngKey)}
                  </Alert>
                </>
              )}

              {(bookedOffers.length > 0) && (
                <>
                  <Spacer height={10}/>
                  <div className="OffersOverviewPage__BookedHeadingWrapper">
                    <Icon icon="check_circle"/> {/* todo: use a star icon, or remove completely: depending on final design */}
                    <Heading rank={6} variant={'secondary'}>
                      {t('Offers.offersOverviewOrder.Title')}
                    </Heading>
                  </div>
                  <Spacer height={6}/>
                  {bookedOffers.map(offer => (
                    <OfferRow
                      key={offer.uuid}
                      title={offer.formattedTitle}
                      description={offer.description || undefined}
                      amount={offer.premium.amount}
                      currency={offer.premium.currencyCode}
                      icon={offer.icon}
                      booked={!isOfferOpen(offer)} // expecting true
                      stateKey={offer.state.key}
                      selected={false}
                      recommendedBy={getAdvisorNameForRecommendation(offer.recommendation, props.offersOverview.advisor)}
                      detailPathname={HISTORY_PATH.OFFER_DETAIL(offer.uuid)}
                    />
                  ))}
                </>
              )}
              {offerGroupsWithOpenOffers.map((offerGroup, index) => (
                <div key={offerGroup.businessCd}>
                  <Spacer height={index === 0 ? 10 : 20}/>
                  <Heading rank={6} variant={'secondary'}>
                    {[`${t('Offers.offersOverviewNoOrder.Title')} ${offerGroup.productName}`, offerGroup.description].filter(Boolean).join(', ')}
                  </Heading>
                  <Spacer height={6}/>
                  {offerGroup.offers.filter(o => isOfferOpen(o)).map(offer => (
                    <OfferRow
                      key={offer.uuid}
                      description={offer.description || undefined}
                      amount={offer.premium.amount}
                      currency={offer.premium.currencyCode}
                      icon={ProductIcon.get(offer.iconId || 0) ?? fallbackProductIcon}
                      booked={!isOfferOpen(offer)} // expecting false
                      selected={isOfferSelected(props.selectedOffersIds, offer.uuid)}
                      recommendedBy={getAdvisorNameForRecommendation(offer.recommendation, props.offersOverview.advisor)}
                      onChange={() => props.toggleSelected(offer.uuid)}
                      onDownload={() => downloadByEcmDocId(offer.offerDocument.ecmDocId)}
                      detailPathname={HISTORY_PATH.OFFER_DETAIL(offer.uuid)}
                    />
                  ))}
                </div>
              ))}
            </TileOffset>
          </Tile>
        </LoadingSpinner>

        {!!props.offersOverview.advisor && (
          <AdvisorTile
            advisor={props.offersOverview.advisor}
            anchorLink={ADVISOR_TILE_ANCHOR_ID}
          />
        )}

      </Container>
    </Page>
  );
};
