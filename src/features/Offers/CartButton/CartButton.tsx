import CheckSvg from '@axa-ch/materials/icons/check.svg.js';
import { ButtonLink } from '@components/ButtonLink';
import { HISTORY_PATH } from '../constants';
import { useTranslation } from '../hooks';
import { useHistory } from 'react-router';
import * as React from 'react';

export type CartButtonType = {
  itemsCount: number;
  children?: never;
};

/**
 * button for offers list which shows how many items is selected and can be added to cart using onClick fn
 */
export const CartButton: React.FC<CartButtonType> = ({ itemsCount }) => {

  const t = useTranslation();
  const history = useHistory();

  return (
    <ButtonLink
      icon={CheckSvg}
      href={history.createHref({ pathname: HISTORY_PATH.CHECKOUT })}
    >
      {t('Offers.offersOrderAll.label').replace('\{{Number}}', itemsCount ? `(${itemsCount})` : '')}
    </ButtonLink>
  );
};
