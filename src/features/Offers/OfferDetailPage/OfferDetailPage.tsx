import AssignmentIndIcon from '@axa-ch/materials/icons/assignment_ind.svg.js';
import KeyboardArrowLeftIcon from '@axa-ch/materials/icons/keyboard_arrow_left.svg.js';
import AddCircleOutline from '@axa-ch/materials/icons/add_circle_outline.svg.js';
import RemoveCircleOutline from '@axa-ch/materials/icons/remove_circle_outline.svg.js';
import { Alert } from '@components/Alert';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import { ButtonLink } from '@components/ButtonLink';
import { Container } from '@components/Grid';
import { LabelValue } from '@components/LabelValue';
import { Link } from '@components/Link';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { Page } from '@components/Page';
import { Heading } from '@components/Heading';
import { Spacer } from '@components/Spacer';
import { Tile, TileOffset } from '@components/Tile';
import { AvbLink } from './AvbLink';
import { downloadPdsDocument, navigateToFileByDokIdEcm } from '../downloadFunctions';
import { CartButton } from '../CartButton';
import { OffersContext } from '../OffersContext';
import {
  getAdvisorNameForRecommendation,
  getFlatOfferDetails,
  getSingleOfferDetail,
  isOfferOpen,
} from '../functions';
import { Total } from '../Total';
import { formatDate } from '../../../functions';
import { ADVISOR_TILE_ANCHOR_ID, AdvisorTile, scrollToAdvisorTile } from '../AdvisorTile';
import { useTranslation } from '../hooks';
import { HISTORY_PATH, OFFER_STATUS_KEY } from '../constants';
import * as React from 'react';
import { useParams, useHistory } from 'react-router';
import { OfferOverview } from '../interfaces';
import './OfferDetailPage.scss';

type Props = {
  /** raw data = response from offers api call */
  offersOverview: OfferOverview;
  /** array of selected offers uuids */
  selectedOffersIds: string[],
  /** fn to toggle selected state for specific offer */
  toggleSelected: (offerUuid: string) => void,
  /** fn to select only one offer (will dump all previously selected offers) */
  selectOneOffer: (offerUuid: string) => void,
  children?: never;
};

/**
 * OffersOverview page template (list of all offers)
 */
export const OfferDetailPage: React.FC<Props> = (props) => {

  const offersContextConsumer = React.useContext(OffersContext);
  const t = useTranslation();
  const routeParams = useParams<{ offerUuid?: string }>();
  const history = useHistory();

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [errorLngKey, setErrorLngKey] = React.useState<string>(); // a download error message lng key; message displayed in an Alert

  if (!routeParams.offerUuid) {
    return null;
  }

  const offerDetails = getFlatOfferDetails(props.offersOverview, props.selectedOffersIds);
  const offer = getSingleOfferDetail(offerDetails, routeParams.offerUuid);

  if (!offer) {
    return null;
  }

  // pubDocId can be null so make sure that we render only existing docs!
  const validAvbDocuments = offer.avbDocuments?.filter(avb => avb.pubDocId !== null);

  // undefined for booked offer
  const toggleSelected = !isOfferOpen(offer) ? undefined : () => props.toggleSelected(offer.uuid);

  const recommendedBy = getAdvisorNameForRecommendation(offer.recommendation, props.offersOverview.advisor);

  const downloadHandlers = { setErrorLngKey, setLoading };

  // for AVBs from PDS store
  const downloadByPubDocId = (avbDocPubDocId: number) => {
    downloadPdsDocument(
      { dokId: avbDocPubDocId, language: offersContextConsumer.language },
      offersContextConsumer.apiBaseUrl,
      offersContextConsumer.clientId,
      downloadHandlers,
    );
  };

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
        <div className={'OffersDetailPage__LinksWrapper'}>
          <Link
            icon={KeyboardArrowLeftIcon}
            variant={'icon'}
            href={history.createHref({ pathname: HISTORY_PATH.OFFERS_OVERVIEW })}
          >
            {t('Offers.offersOrderBack.label')}
          </Link>

          <Link
            icon={AssignmentIndIcon}
            variant={'icon'}
            onClick={scrollToAdvisorTile}
          >
            {t('Offers.offersOverviewShowAgentInfo.label')}
          </Link>
        </div>

        <Tile title={offer.productName}>
          <TileOffset bottomSpacing>
            <div className={'OffersDetailPage__Content'}>
              <div className={'OffersDetailPage__Box'}>
                <div className="OffersDetailPage__BoxInner">
                  {recommendedBy && (
                    <Badge
                      className={'OffersDetailPage__recommendedBadge'}
                      value={`${t('Offers.offersRecommendation.label')} ${recommendedBy}`}
                    />
                  )}
                  <Heading rank={5}>{t('Offers.offersDetail.Title')}
                    {/* We show the badge 'ordered' if the user has already ordered an offer */}
                    {(offer.state.key === OFFER_STATUS_KEY.ACTIVE || offer.state.key === OFFER_STATUS_KEY.ORDERED) && (
                      <Badge
                        className={'OfferDetailPage__bookedBadge'}
                        value={(t('Offers.offersOverviewOrderDate.label') || '').toUpperCase()}
                      />
                    )}
                  </Heading>
                  <LabelValue
                    colsSize={'50by50'}
                    mode={'rows'}
                    items={[
                      { key: '1', label: t('Offers.offersDetailStart.label'), value: formatDate(offer.contractFrom) },
                      { key: '2', label: t('Offers.offersDetailAdditionalInfo.label'), value: offer.descriptionOfferGroup || '' },
                      { key: '3', label: t('Offers.offersDetailDescription.label'), value: offer.description || '' },
                    ].filter(row => !!row.value)}
                  />
                </div>
              </div>
              <div className={'OffersDetailPage__Box'}>
                <LoadingSpinner backdrop isLoading={isLoading}>
                  <div className={'OffersDetailPage__BoxInner'}>
                    <Heading rank={5}>{t('Offers.offersDetailDokument.Title')}</Heading>
                    {errorLngKey && (
                      <>
                        <Alert
                          type="error"
                          animate
                        >
                          {t(errorLngKey)}
                        </Alert>
                        <Spacer/>
                      </>
                    )}
                    <div className={'OffersDetailPage__DownloadLinksWrapper'}>
                      {
                        offer.offerDocument && (
                          <Link
                            key={offer.offerDocument.ecmDocId}
                            icon={'download'}
                            variant={'icon'}
                            onClick={() => downloadByEcmDocId(offer.offerDocument.ecmDocId)}
                            className={'OffersDetailPage__DownloadLink--offerDocument'}
                          >
                            {offer.offerDocument.title}
                          </Link>
                        )
                      }
                      {
                        !!props.offersOverview.advisor && (
                          <Link
                            key={1}
                            icon={'download'}
                            variant={'icon'}
                            external={true}
                            href={props.offersOverview.advisor.advisorInformationDocument.url}
                            className={'OffersDetailPage__DownloadLink--advisorDocument'}
                          >
                            {props.offersOverview.advisor.advisorInformationDocument.label}
                          </Link>
                        )
                      }
                      {validAvbDocuments.length > 0 && (
                        <>
                          <Heading
                            className={'OffersDetailPage__DownloadTitle--avb'}
                            rank={5}
                          >
                            {t('Offers.versicherungsbedingungen.label')}
                          </Heading>
                          {
                            validAvbDocuments.map((avbDoc, index) => (
                              <AvbLink
                                key={avbDoc.pubDocId}
                                avbDocId={avbDoc.pubDocId!}
                                index={index}
                                onDownload={id => downloadByPubDocId(id)}
                                className={'OffersDetailPage__DownloadLink--avbDocument'}
                              />
                            ))
                          }
                        </>
                      )}
                    </div>

                  </div>
                </LoadingSpinner>

                <Total
                  label={t('Offers.offersDetailPrime.label')}
                  amount={offer.premium.amount}
                />

                {/* show the button 'select offer' and 'order offers' only if the offer is still available */}
                {offer.state.key === OFFER_STATUS_KEY.OPEN && (
                  <div className="OfferDetailPage__ButtonWrapper">
                    {!!toggleSelected && (
                      <div>
                        <Button
                          variant={'secondary'}
                          icon={offer.isSelected ? RemoveCircleOutline : AddCircleOutline}
                          onClick={toggleSelected}
                        >
                          {t(`Offers.${offer.isSelected ? 'offersDetailRemoveOffert' : 'offersDetailAdOffert'}.label`)}
                        </Button>
                      </div>
                    )}
                    <div>
                      {offer.isSelected ? (
                        <CartButton itemsCount={props.selectedOffersIds.length}/>
                      ) : (
                        <ButtonLink
                          href={history.createHref({ pathname: HISTORY_PATH.CHECKOUT })}
                          onClick={() => {
                            props.selectOneOffer(offer.uuid);
                          }}
                        >
                          {t('Offers.offersDetailOrderOffert.label')}
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </TileOffset>
        </Tile>

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
