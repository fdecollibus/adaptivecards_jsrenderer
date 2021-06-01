import * as React from 'react';
import cx from 'classnames';
import { TileOffset } from './TileOffset';

type Props = {
  className?: string;
};

/**
 *  Renders <TileOffset mobileOnly>
 */
export const TileOffsetMobile: React.FC<Props> = ({className, children}) => (
  <TileOffset className={cx(className)} mobileOnly={true}>
    {children}
  </TileOffset>
);
