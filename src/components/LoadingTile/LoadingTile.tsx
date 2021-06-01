import { LoadingSpinner } from '../LoadingSpinner';
import { Tile, TileProps } from '../Tile';
import * as React from 'react';
import './LoadingTile.scss';
import cx from 'classnames';

type Props = {
  isLoading?: boolean,
  children?: never,
};

export const LoadingTile: React.FC<Props & TileProps> = ({isLoading = true, className, ...tileProps}) => {
  return (
    <Tile
      className={cx('LoadingTile', className)}
      {...tileProps}
    >
      <LoadingSpinner isLoading={isLoading}/>
    </Tile>
  );
};
