import { Alert } from '@components/Alert';
import { ButtonLink } from '@components/ButtonLink';
import { Container } from '@components/Grid';
import { Heading } from '@components/Heading';
import { Page } from '@components/Page';
import { Spacer } from '@components/Spacer';
import { Tile, TileOffset } from '@components/Tile';
import { Typo } from '@components/Typo';
import * as React from 'react';
import { useHistory } from 'react-router';
import { HISTORY_PATH } from '../constants';
import { useTranslation } from '../hooks';
import './OffersResultPage.scss';

type OffersResultPageProps = {
  /** true if error occurred during submitting form, false if all is ok */
  error: boolean;
  /** when error = false, we display email from POST response in text */
  email?: string;
};

export const OffersResultPage: React.FC<OffersResultPageProps> = (props) => {

  const t = useTranslation();
  const history = useHistory();

  return (
    <Page>
      <Container>
        <Tile
          title={t(props.error ? 'Offers.offersOrderNOk.Titel' : 'Offers.offersOrderOk.Titel')}
          className={'OffersResultPage__Tile'}
          onCloseHref={history.createHref({ pathname: HISTORY_PATH.OFFERS_OVERVIEW })}
        >
          <TileOffset bottomSpacing className={'OffersResultPage__MainContent'}>
            <Alert type={props.error ? 'danger' : 'success'}>
              {t(props.error ? 'Offers.offersOrderNOkText1.label' : 'Offers.offersOrderOkText1.label')}
            </Alert>
            <Spacer height={30}/>
            {props.error ? (
              <>
                <Typo size={'t2'}>{t('Offers.offersOrderNOkText2.label')}</Typo>
              </>
            ) : (
              <>
                <Typo size={'t2'} tag={'div'}>{t('Offers.offersOrderOkText2.label')}</Typo>
                <Typo size={'t2'} tag={'div'}>
                  <div dangerouslySetInnerHTML={{ __html: t('Offers.offersOrderOkText3.label').replace('\{{Mail}}', props.email ?? '') }}>
                  </div>
                </Typo>
              </>
            )}
            <Spacer height={30}/>
            <ButtonLink
              icon={'arrow-left'}
              href={history.createHref({ pathname: HISTORY_PATH.OFFERS_OVERVIEW })}
            >
              {t('Offers.offersOrderBack.label')}
            </ButtonLink>
            {!props.error && (
              <>
                <Spacer height={80}/>
                <Heading rank={4}>
                  {t('Offers.offersOrderNextStep.Title')}
                </Heading>
                {[1, 2, 3].map(row => (
                  <div
                    key={row}
                    className={'OffersResultPage__list'}
                  >
                    <Heading rank={2} variant={'secondary'}>{row}</Heading>
                    <Typo size={'t1'}>
                      {t(`Offers.offersOrderNextStep${row}.label`)}
                    </Typo>
                  </div>
                ))}
              </>
            )}
          </TileOffset>
        </Tile>

      </Container>
    </Page>

  );
};
