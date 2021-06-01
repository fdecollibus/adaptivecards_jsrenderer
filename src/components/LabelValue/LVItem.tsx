import * as React from 'react';
import cx from 'classnames';
import { LabelValueItemType } from './LabelValue';

import './LVItem.scss';

type Props = Omit<LabelValueItemType, 'key'> & React.HTMLAttributes<HTMLDivElement>;

/**
 * LVItem
 *
 * To be used inside LabelValue.
 *
 * Accepts a required 'label' string and an optional 'value' and/or 'children' props.
 * Also accepts standard HTMLAttributes, that are applied to the wrapping div.LVItem.
 *
 * @link https://www.w3schools.com/tags/tag_dt.asp
 * @link https://www.w3schools.com/tags/tag_dd.asp
 */
export const LVItem: React.FC<Props> = ({ label, value, children, className, ...props }) => {
  return (
    <div className={cx('LVItem', className)} {...props}>
      <dt className={cx('LVItem__Label')}>
        {label}
      </dt>
      <dd className={cx('LVItem__Value')}>
        {value}
        {children}
      </dd>
    </div>
  );
};
