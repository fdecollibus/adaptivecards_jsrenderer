import * as React from 'react';
import './Container.scss';
import cx from 'classnames';

type Props = {
  className?: string;
  fluid?: boolean;
};

/**
 * Replacement for PLv1's AXAContainer
 */
export const Container: React.FC<Props> = ({fluid, className, children}) => {
  return (
    <article className={cx({Container: !fluid, 'Container-fluid': fluid}, className)}>
      {children}
    </article>
  );
};
