import * as React from 'react';
import './Page.scss';
import cx from 'classnames';

type Props = {
  className?: string;
};

/**
 * Page
 *
 * Component with its background color.
 */
export const Page: React.FC<Props> = ({children, className}) => {
  return (
    <div className={cx('Page', className)}>
      {children}
    </div>
  );
};
