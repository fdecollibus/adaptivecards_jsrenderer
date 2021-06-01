import * as React from 'react';
import cx from 'classnames';
import { Col, Row } from '../Grid';
import './TileOffset.scss';

type TileOffsetProps = {
  className?: string;
  /**
   * If true, offset is applied only for desktop viewport width
   */
  mobileOnly?: boolean;
  /**
   * If true, offset is applied only for mobile viewport width
   */
  desktopOnly?: boolean;
  /**
   * Affects spacing.
   *
   * Set to true if two Tiles are shown side by side on Lg screens and up.
   * Tile offset is doubled in this case.
   */
  isHalfLg?: boolean;
  /**
   * Adds bottom spacing.
   *
   * Ensures space between content and tile bottom border.
   */
  bottomSpacing?: boolean;
  /**
   * Same as bottomSpacing, but applied only for desktop viewport width
   */
  bottomSpacingDesktopOnly?: boolean;
};

/**
 *  TileOffset is component that handle 1 col offset on sides of Tile (inner)
 */
export const TileOffset: React.FC<TileOffsetProps> = (
  {className, bottomSpacing, bottomSpacingDesktopOnly, desktopOnly, children, isHalfLg, mobileOnly},
) => (
  <Row className={cx('TileOffset', className, {
    ['TileOffset--mobileOnly']: mobileOnly,
    ['TileOffset--desktopOnly']: desktopOnly,
    ['TileOffset--bottomSpacing']: bottomSpacing,
    ['TileOffset--bottomSpacingDesktopOnly']: bottomSpacingDesktopOnly,
  })}>
    <Col size={isHalfLg ? '10 lg-9' : '10'} offset={isHalfLg ? '1 lg-2' : '1'}>
      {children}
    </Col>
  </Row>
);
