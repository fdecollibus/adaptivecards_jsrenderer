import * as React from 'react';
import cx from 'classnames';
import { TileOffset } from './TileOffset';

type Props = {
  className?: string;
};

/**
 *  Renders <TileOffset desktopOnly>
 */
export const TileOffsetDesktop: React.FC<Props> = ({className, children}) => (
  <TileOffset className={cx(className)} desktopOnly={true}>
    {children}
  </TileOffset>
);
