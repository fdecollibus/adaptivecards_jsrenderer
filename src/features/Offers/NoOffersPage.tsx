import phoneIcon from '@axa-ch/materials/icons/phone.svg.js';
import { OffersContext } from '@features/Offers/OffersContext';
import * as React from 'react';
import { Alert } from '@components/Alert';
import { ButtonLink } from '@components/ButtonLink';
import { Container } from '@components/Grid';
import { Heading } from '@components/Heading';
import { Link } from '@components/Link';
import { Page } from '@components/Page';
import { Spacer } from '@components/Spacer';
import { Tile, TileOffset } from '@components/Tile';
import { Typo } from '@components/Typo';
import { useBackUrlToMyAxa, useTranslation } from './hooks';

type NoOffersPagePageProps = {
  /**
   * NoOffersPage is displayed for different reasons.
   * Not for all is partnerNo (and RegistrationsContext) available so we pass it into component only when available
   */
  partnerNo?: number;
  children?: never;
};

/**
 * Page when no offers available, or no current-registration selected
 */
export const NoOffersPage: React.FC<NoOffersPagePageProps> = ({ partnerNo }) => {

  const t = useTranslation();
  const { applicationId, contactFormUrl, language } = React.useContext(OffersContext);
  const backUrlToMyAxa = useBackUrlToMyAxa();

  /**
   * Create url for href, which points to contact form.
   * Partner number can be undefined, so it's implemented under condition here.
   */
  const getContactFormUrl = () => {
    let url = `${contactFormUrl?.replace('@LANG@', language)}?appl_id=${applicationId}`;
    if (partnerNo) {
      url += `&part_nr=${partnerNo}`;
    }
    return url;
  };

  return (
    <Page>
      <Container>
        <Tile
          title={t('Offers.offersEmpty.title')}
          className={'NoOffersPage__Tile'}
        >
          <TileOffset bottomSpacing>
            <Alert type="danger">
              {t('Offers.offersEmptyAlert.label')}
            </Alert>
            <Spacer height={18}/>
            <Heading rank={6}>{t('Offers.offersEmptyHotline.title')}</Heading>
            <Spacer height={3}/>
            <Typo tag={'div'}>
              {t('Offers.offersEmptyHotline.label')}
            </Typo>
            <Spacer height={19}/>
            <div>
              <Link
                variant={'arrowright'}
                external
                href={getContactFormUrl()}
              >
                {t('Offers.offersEmptyContactformLink.label')}
              </Link>
            </div>
            <Spacer height={10}/>
            <div>
              <Link
                variant={'icon'}
                icon={phoneIcon}
                href={'tel:0800809809'}
              >
                0800 809 809
              </Link>
            </div>
            <Spacer height={38}/>
            <div>
              {/** navigate to referrer or to myaxa base url */}
              <ButtonLink href={backUrlToMyAxa}>
                {t('Offers.offersBackToMyaxaLink.label')}
              </ButtonLink>
            </div>
          </TileOffset>
        </Tile>

      </Container>
    </Page>
  );
};
