import * as React from 'react';
import './Row.scss';
import cx from 'classnames';

type Props = {
  className?: string;
};

/**
 * Replacement for PLv1's AXARow
 */
export const Row: React.FC<Props> = ({className, children}) => {
  return (
    <div className={cx('Row', className)}>
      {children}
    </div>
  );
};
