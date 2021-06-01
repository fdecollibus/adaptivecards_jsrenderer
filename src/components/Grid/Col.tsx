import * as React from 'react';
import './Col.scss';
import cx from 'classnames';

type Props = {
  className?: string;
  offset?: string;
  order?: string;
  size?: string;
};

const prefixWords = (str: string, prefix: string): string => prefix + str.split(' ').join(' ' + prefix);

/**
 * Replacement for PLv1's AXACol
 */
export const Col: React.FC<Props> = (props) => {

  const {className, children} = props;
  let {size, order, offset} = props;

  if (size) {
    size = prefixWords(size, 'u-col-');
  }
  if (order) {
    order = prefixWords(order, 'u-order-');
  }
  if (offset) {
    offset = prefixWords(offset, 'u-offset-');
  }

  return (
    <div className={cx('Col', {'u-col': !size || !size.length}, className, size, order, offset)}>
      {children}
    </div>
  );
};
