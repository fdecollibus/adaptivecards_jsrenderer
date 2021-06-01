import { Icon, IconType } from '@components/Icon';
import { Typo } from '@components/Typo';
import * as React from 'react';
import './OffersCheckoutRow.scss';

type OffersCheckoutRowProps = {
  icon?: IconType;
  title: string;
  description: string | null;
  /* formatted price to show in price placeholder */
  formattedPrice: string;
  /** fn to toggle selected state for specific offer */
  onDeleteClick: () => void;
};

export const OffersCheckoutRow: React.FC<OffersCheckoutRowProps> = (props) => {
  return (
    <div className="OffersCheckoutRow">
      <div className="OffersCheckoutRow__icon">
        {props.icon && (<Icon icon={props.icon} type="illustration"/>)}
      </div>
      <div className="OffersCheckoutRow__allTextsWrapper">
        <div className="OffersCheckoutRow__mainRow">
          <Typo tag={'div'} size={'t3'} fontStyle={'semibold'}>
            {props.title}
          </Typo>
          <Typo tag={'div'} size={'t3'} fontStyle={'semibold'}>
            {props.formattedPrice}
          </Typo>
        </div>
        <div className="OffersCheckoutRow__secondRow">
          {!!props.description && (
            <Typo tag={'div'} size={'t3'}>
              {props.description}
            </Typo>
          )}
        </div>
      </div>
      <div className="OffersCheckoutRow__delete">
        <Icon icon={'close'} type="functional" onClick={props.onDeleteClick}/>
      </div>
    </div>
  );
};
