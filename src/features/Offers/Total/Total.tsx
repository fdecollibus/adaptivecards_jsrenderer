import { Typo } from '@components/Typo';
import { useTranslation } from '../hooks';
import * as React from 'react';
import { formatCurrency, formatCurrencyNoZeroCents } from '../../../functions';
import './Total.scss';

export type TotalProps = {
  /**
   * Translated label
   *
   * Examples: "Total", "Premium"
   */
  label: string;
  amount: number;
  currency?: string;
  children?: never;
};

/**
 * Component with similar size as Button renders Total amount (number) to pay and divide this value by 12 (monthly)
 */
export const Total: React.FC<TotalProps> = (props) => {
  const { amount, currency = 'CHF' } = props;

  const t = useTranslation();

  return (
    <div className={'Total'}>
      <Typo
        className={'Total__label'}
        size={'t2'}
        fontStyle={'bold'}
      >
        {props.label}
      </Typo>
      <Typo
        className={'Total__amountYear'}
        size={'t3'}
        fontStyle={'bold'}
      >
        {formatCurrency(amount, currency)}
      </Typo>
      <Typo
        className={'Total__amountMonth'}
        size={'t3'}
      >
        {
          t('Offers.offersAmountMonth.label')
            .replace('\{{Curr}}', currency)
            .replace('\{{Amount}}', formatCurrencyNoZeroCents(amount / 12, '').toString())
        }
      </Typo>
    </div>
  );
};
