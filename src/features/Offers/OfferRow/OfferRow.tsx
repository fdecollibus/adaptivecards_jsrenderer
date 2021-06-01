import { Badge } from '@components/Badge';
import { getStateTranslationId } from '../functions';
import { useTranslation } from '../hooks';
import classnames from 'classnames';
import { Checkbox } from '@components/Checkbox';
import { Icon, IconType } from '@components/Icon';
import { Link } from '@components/Link';
import * as React from 'react';
import { useHistory } from 'react-router';
import './OfferRow.scss';
import { formatCurrencyNoZeroCents } from '../../../functions';

export type OfferRowProps = {
  /** title is first row in titleArea formatted as bold, if missing - whole col is still vertically aligned to centered */
  title?: string;
  /** title is second row in titleArea formatted as regular text, if missing - whole col still vertically aligned to centered */
  description?: string;
  /**
   * rendered grayed out, doesn't trigger onChange
   * booked === !opened  -> so booked is if it is ordered or processing
   */
  booked: boolean;
  selected: boolean;
  icon: IconType;
  /** amount to pay as number - not formatted */
  amount: number;
  /** e.g. 'CHF' */
  currency: string;
  /** name of advisor that recommends offer */
  recommendedBy?: string;
  /**
   * Checkbox click handler
   *
   * (not provided for booked offers)
   */
  onChange?: () => void;
  /**
   * pathname to "DETAILS" page
   */
  detailPathname: string;
  /**
   * fn to trigger file download
   */
  onDownload?: () => void;
  /** offer state key - used to render correct translation in badge */
  stateKey?: string;
  /** no children are allowed */
  children?: never;
};

/**
 * OfferRow
 *
 * Controlled by selected/onChange props.
 */
export const OfferRow: React.FC<OfferRowProps> = (props) => {

  const t = useTranslation();
  const history = useHistory();

  const containerClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // so that click over the checkbox doesn't reach the checkbox
    if (props.onChange && !props.booked) {
      props.onChange();
    }
  };

  const checkboxClickHandler = (e: any) => {
    // no action here per purpose
  };

  const downloadClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    props.onDownload?.();
  };

  const detailsClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    /**
     * Parent element has onClick to selecting row.
     * We stopPropagation to avoid selecting row when clicking on Link.
     * Navigation using tab+enter works because href is set on element.
     */
    e.stopPropagation();
    history.push(props.detailPathname);
  };

  return (
    <div
      className={classnames('OfferRow', {
        'OfferRow--booked': !!props.booked,
        'OfferRow--selected': !!props.selected,
      })}
      onClick={containerClickHandler}
    >
      {props.recommendedBy && (
        <Badge
          className={'OfferRow__recommendedBadge'}
          value={`${t('Offers.offersRecommendation.label')} ${props.recommendedBy}`}
        />
      )}
      <div className="OfferRow__inner">
        {
          !props.booked && (
            <div className="OfferRow__checkboxCol">
              <Checkbox
                checked={props.selected || props.booked}
                onChange={checkboxClickHandler}
                variant="checkmark"
                // not disabled for visual fill style
                disabled={false}
                // disabled={props.inCart || props.booked}
              />
            </div>
          )
        }
        <div className="OfferRow__textsWrapper">
          <div className="OfferRow__iconCol">
            <Icon className="OfferRow__Icon" icon={props.icon}/>
          </div>
          <div className="OfferRow__titlesWrapper">
            {props.title && (
              <div className="OfferRow__title">
                {props.title}
              </div>
            )}
            {props.description && (
              <div className="OfferRow__description">
                {props.description}
              </div>
            )}
          </div>
          {!props.booked && (
            <div className="OfferRow__amountCol">
              {formatCurrencyNoZeroCents(props.amount, props.currency)}
            </div>
          )}
          {(props.booked && props.stateKey) && (
            <div className="OfferRow__bookedCol">
              <Badge
                className={classnames('OfferRow__bookedBadge', `OfferRow__bookedBadge--${props.stateKey}`)}
                value={(t(getStateTranslationId(props.stateKey)) || '').toUpperCase()}
              />
            </div>
          )}
        </div>
        <div className="OfferRow__linksWrapper">
          <div className="OfferRow__downloadCol">
            {!!props.onDownload && (
              <Link
                variant="arrowright"
                onClick={downloadClickHandler}
              >
                {t('Offers.offersOverviewShowOffer.label')}
              </Link>
            )}
          </div>
          <div className="OfferRow__detailCol">
            <Link
              variant="arrowright"
              href={history.createHref({ pathname: props.detailPathname })}
              onClick={detailsClickHandler}
            >
              {t('Offers.offersOverviewDetail.label')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
