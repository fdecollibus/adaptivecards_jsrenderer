import * as React from 'react';

import './Typo.scss';
import cx from 'classnames';

export const TYPO_FONT_STYLE = ['bold', 'semibold', 'italic'] as const;
export const TYPO_TAG_OPTS = ['span', 'div'] as const;
export const TYPO_SIZE_DEFAULT = 'medium';
export const TYPO_VARIANT = ['t4', 't3', 't2', 't1'] as const;
const TYPO_VARIANT_LEGACY = {
  default: 't4',
  'small-1': 't4',
  medium: 't3',
  'medium-1': 't2',
  large: 't1',
};
const mapLegacyTypoVariant = (variant: keyof typeof TYPO_VARIANT_LEGACY) => {
  return TYPO_VARIANT_LEGACY[variant];
};

type Props = {

  className?: string;

  /**
   * defaults to 'medium'
   */
  size?: keyof typeof TYPO_VARIANT_LEGACY | typeof TYPO_VARIANT[number];

  /**
   * defaults to undefined
   */
  fontStyle?: typeof TYPO_FONT_STYLE[number];

  style?: React.CSSProperties;

  /**
   * defaults to 'span'
   */
  tag?: typeof TYPO_TAG_OPTS[number];

};

/**
 * Helper component that applies the `typography` and `typo` mixins classes to the children.
 *
 * See src/styles/_typo.scss
 */
export const Typo: React.FC<Props> = ({
                                        size = TYPO_SIZE_DEFAULT,
                                        fontStyle,
                                        tag = TYPO_TAG_OPTS[0],
                                        children,
                                        className,
                                        style,
                                      }) => {

  const optimizedSize = Object.keys(TYPO_VARIANT_LEGACY).includes(size as any)
    ? mapLegacyTypoVariant(size as any)
    : size;

  return React.createElement(
    tag,
    {className: cx('Typo', fontStyle ? `Typo-${optimizedSize}-${fontStyle}` : `Typo-${optimizedSize}`, className), style},
    children,
  );
};
