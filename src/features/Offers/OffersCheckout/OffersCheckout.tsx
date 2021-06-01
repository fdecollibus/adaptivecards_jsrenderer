import { ButtonLink } from '@components/ButtonLink';
import { Link } from '@components/Link';
import { Checkbox } from '@components/Checkbox';
import { Container } from '@components/Grid';
import { Page } from '@components/Page';
import { Tile, TileOffset } from '@components/Tile';
import { Typo } from '@components/Typo';
import { getFlatOfferDetails, getTotalAmountOfSelectedOffers } from '@features/Offers/functions';
import { useTranslation } from '@features/Offers/hooks';
import { OffersCheckoutRow } from '@features/Offers/OffersCheckout/OffersCheckoutRow';
import * as React from 'react';
import { useHistory } from 'react-router';
import { formatCurrency, formatCurrencyNoZeroCents } from '../../../functions';
import { HISTORY_PATH } from '../constants';
import { OfferOverview } from '../interfaces';
import './OffersCheckout.scss';
import LandscapeSvg from '@assets/landscape.svg';
import ChevronLeftSvg from '@axa-ch/materials/icons/chevron_left.svg.js';
import CheckSvg from '@axa-ch/materials/icons/check.svg.js';

type OffersCheckoutProps = {
  /** raw data = response from offers api call */
  offersOverview: OfferOverview;
  /** array of selected offers uuids */
  selectedOffersIds: string[],
  submitOffers: () => void;
  /** fn to toggle selected state for specific offer */
  toggleSelected: (offerUuid: string) => void,
  children?: never;
};

export const OffersCheckout: React.FC<OffersCheckoutProps> = (props) => {

  const history = useHistory();
  const t = useTranslation();
  const [verifyDataCheckboxChecked, setVerifyDataCheckboxChecked] = React.useState<boolean>(false);
  const [termsCheckboxChecked, setTermsCheckboxChecked] = React.useState<boolean>(false);

  const selectedOffers = getFlatOfferDetails(props.offersOverview, props.selectedOffersIds)
    .filter(o => o.isSelected);
  const totalAmount = getTotalAmountOfSelectedOffers(selectedOffers);

  const isFormValid = () => (verifyDataCheckboxChecked && termsCheckboxChecked && selectedOffers.length > 0);

  const checkoutHandler = () => {
    if (isFormValid()) {
      props.submitOffers();
    }
  };

  return (
    <Page className="OffersCheckout">
      <Container className="OffersCheckout__Container">
        <Link
          href={history.createHref({ pathname: HISTORY_PATH.OFFERS_OVERVIEW })}
          icon={ChevronLeftSvg}
          variant="icon"
        >
          {t('Offers.offersOrderBack.label')}
        </Link>
        <Tile
          className="OffersCheckout__Tile"
          title={t('Offers.offersOrder.Title')}
        >
          <TileOffset bottomSpacing>
            {selectedOffers.length === 0 ? (
              <div className="OffersCheckout__noItemsMessage">
                <Link
                  href={history.createHref({ pathname: HISTORY_PATH.OFFERS_OVERVIEW })}
                  icon={ChevronLeftSvg}
                  variant="icon"
                >
                  {t('Offers.offersOrderBack2.label')}
                </Link>
              </div>
            ) : (
              <>
                <div className="OffersCheckoutList">
                  {selectedOffers.map(offer => (
                    <OffersCheckoutRow
                      key={offer.uuid}
                      icon={offer.icon}
                      title={offer.formattedTitle}
                      description={offer.description}
                      formattedPrice={formatCurrency(offer.premium.amount)}
                      onDeleteClick={() => props.toggleSelected(offer.uuid)}
                    />
                  ))}
                  <div className="OffersCheckout__SummaryRow">
                    <Typo tag={'div'} size={'t1'} fontStyle={'semibold'} className={'OffersCheckout__SummaryRowLabel'}>
                      {t('Offers.offersOrderTotal.label')}
                    </Typo>
                    <Typo tag={'div'} size={'t2'} fontStyle={'semibold'}>
                      {formatCurrency(totalAmount)}
                    </Typo>
                    <Typo tag={'div'} size={'t4'} fontStyle={'semibold'} className={'OffersCheckout__SummaryRowPriceMonthly'}>
                      {
                        t('Offers.offersAmountMonth.label')
                          .replace('\{{Curr}}', 'CHF')
                          .replace('\{{Amount}}', formatCurrencyNoZeroCents(totalAmount / 12, '').toString())
                      }
                    </Typo>
                  </div>
                </div>
                <form className="OffersCheckout__form">
                  <Checkbox
                    required
                    name="verifyDataCheckbox"
                    variant="checkmark"
                    checked={verifyDataCheckboxChecked}
                    onChange={() => setVerifyDataCheckboxChecked(prevValue => !prevValue)}
                    label={t('Offers.offersOrderInfo1.label')}
                  />
                  <Checkbox
                    required
                    name="termsCheckbox"
                    variant="checkmark"
                    checked={termsCheckboxChecked}
                    onChange={() => setTermsCheckboxChecked(prevValue => !prevValue)}
                    label={t('Offers.offersOrderInfo2.label')}
                  />
                  <div className="OffersCheckout__ButtonWrapper">
                    <ButtonLink
                      onClick={checkoutHandler}
                      href={history.createHref({ pathname: HISTORY_PATH.CONFIRMATION })}
                      variant="red"
                      icon={CheckSvg}
                      disabled={!isFormValid()}
                    >
                      {t('Offers.offersOrderSend.label')}
                    </ButtonLink>
                  </div>
                </form>
              </>
            )}
          </TileOffset>
        </Tile>
      </Container>
      <div className="OffersCheckout__background">
        <LandscapeSvg/>
      </div>
    </Page>
  );
};
