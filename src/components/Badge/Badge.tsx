import * as React from 'react';
import './Badge.scss';
import cx from 'classnames';
import { AnyFunction } from '../../types';
import { BadgeValue, BadgeValuePropTypes } from './BadgeValue';

export type BadgePropTypes = {
  /** value is optional, if empty badge hides using css display prop */
  value?: string | number | BadgeValuePropTypes;
  /** if true, shows empty red circle on mobile and regular badge with value on desktop */
  emptyOnMobile?: boolean;
  /** small - 18x18px, large 30x30px */
  size?: 'small' | 'large'
  className?: string;
  /** function to execute on click anywhere on badge */
  onBadgeClick?: AnyFunction;
};

/**
 * Badge is component to display value in red bubble/pill. It is used for notifications.
 */
export const Badge: React.FC<BadgePropTypes> = ({value, emptyOnMobile, size, onBadgeClick, className}) => {

  // used to display action name when mouse hovers over badge
  const [isHover, setHover] = React.useState<boolean>(false);
  const HOVER_DURATION = 1000; // ms
  const timer = React.useRef<number>();

  // clear timer on unmount (otherwise react yells a warning)
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      {value && (
        <>
          <span
            className={cx(
              'Badge',
              {
                'Badge--empty-on-mobile': emptyOnMobile,
                'Badge--large': size === 'large',
                'Badge--small': size === 'small',
                'Badge--clickable': !!onBadgeClick,
              },
              className,
            )}
            onClick={onBadgeClick}
            onMouseEnter={() => {
              window.clearTimeout(timer.current);
              setHover(true);
            }}
            onMouseLeave={() => timer.current = window.setTimeout(() => setHover(false), HOVER_DURATION)}
          >
            {typeof value === 'object' ? React.createElement(BadgeValue, {...value, isHover}) : value}
          </span>
          {emptyOnMobile && <span className={cx('Badge--mobile')} onClick={onBadgeClick}></span>}
        </>
      )}
    </>
  );
};

Badge.defaultProps = {
  size: 'small',
};
