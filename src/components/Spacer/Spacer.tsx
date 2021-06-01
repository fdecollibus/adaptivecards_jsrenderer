import * as React from 'react';

export const HEIGHT_STEP = 20; // px; exported only for storybook story

type Props = {
  /**
   * does 40px space (2 * 20px)
   */
  double?: boolean
  /**
   * does 60px space (3 * 20px)
   */
  triple?: boolean
  /**
   * does 80px space (4 * 20px)
   */
  quadruple?: boolean
  /**
   * height in px
   */
  height?: number;
  children?: never;
};

/**
 * Does vertical spacing in multiplies of 20px (default 1x); or a specific height
 */
export const Spacer: React.FC<Props> = ({double, triple, quadruple, height}) => {
  let h;
  let multiplier = 1;
  if (double) {
    multiplier = 2;
  } else if (triple) {
    multiplier = 3;
  } else if (quadruple) {
    multiplier = 4;
  } else {
    h = height;
  }
  if (h === undefined) {
    h = multiplier * HEIGHT_STEP;
  }
  return (
    <div style={{height: h}}/>
  );
};
