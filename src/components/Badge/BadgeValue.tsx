import { Icon } from '../Icon';
import * as React from 'react';
import cx from 'classnames';

export type BadgeValuePropTypes = {
  /** default label */
  label: string;
  /** label displayed on hover */
  actionLabel: string | undefined;
  /** wheter icon should be displayed on hover */
  displayIcon?: boolean;
  /** whether the user is hovering over label or not */
  isHover?: boolean;
};

export const BadgeValue: React.FC<BadgeValuePropTypes> = ({label, actionLabel, displayIcon, isHover}) => {

  return (
    <>
      {isHover ?
        <div className={cx('CardContent__badgeAction')}>
          {actionLabel}
          {displayIcon && <Icon icon={'arrow-right'}/>}
        </div>
        :
        <div>
          {label}
        </div>}
    </>
  );
};
