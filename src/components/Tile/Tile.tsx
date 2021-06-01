import * as React from 'react';
import './Tile.scss';
import cx from 'classnames';
import { TileHeader, TileHeaderProps } from './TileHeader';
import { TileOffset } from './TileOffset';

export type TileProps = TileHeaderProps & {
  /** for some cases you can extent class */
  className?: string;
  /**
   * Affects the TileOffset.
   *
   * Set to true if two Tiles are shown side by side on Lg screens and up.
   * Tile offset is doubled in this case.
   */
  isHalfLg?: boolean;
  /**
   * Identifier for anchor navigation. Will be rendered as `id` attribute of the Tile's `div`.
   */
  anchorNavId?: string;
};

/**
 * Tile component is main building part of pages.
 * Should appear as child(ren) of Page component
 */
export const Tile: React.FC<TileProps> = ({className, children, isHalfLg, anchorNavId, ...props}) => {

  return (
    <div
      id={anchorNavId}
      className={
        cx(
          'Tile',
          className,
        )
      }
    >
      <TileOffset isHalfLg={isHalfLg}>
        <TileHeader
          {...props}
        />
      </TileOffset>

      {children}
    </div>
  );
};
