import * as React from 'react';
import cx from 'classnames';
import { InlineSvg } from '../InlineSvg';
import { localIcons } from './localIcons';
import { plIcons } from './plIcons';
import { plImages } from './plImages';

import './Icon.scss';

export type IconType = keyof typeof localIcons | keyof typeof plIcons | keyof typeof plImages;

type Props = {
  /** render from plIcons only; for storybook; good for debugging the differences/duplicities between plIcons/localIcons */
  forcePlIcon?: boolean;
  /** render from localIcons only; for storybook; good for debugging the differences/duplicities between plIcons/localIcons */
  forceLocalIcon?: boolean;
  /** icon type */
  icon: IconType;
  /** classes to style icon */
  className?: string;
  /**
   * Purpose - applies class with dimensions
   * 'functional' - smaller general icons
   * 'illustration' - for bigger product icons
   *  empty - no class applied
   */
  type?: 'functional' | 'illustration';
  /** fn to handle click event on icon */
  onClick?: (e: React.MouseEvent) => void;
};

/**
 * Icon is 'dumb' component to display Icon and optionally handle clicks
 *
 * - pl icons are strings of svg code
 * - local icons are react components (transformed by bundler's svg plugin)
 */
export const Icon: React.FC<Props> = (props) => {

  const className = cx('Icon', props.className, {
    'Icon--action': !!props.onClick,
    'Icon--functional': props.type === 'functional',
    'Icon--illustration': props.type === 'illustration',
  });

  const isPlIcon = Object.keys(plIcons).includes(props.icon);
  if ((isPlIcon || props.forcePlIcon) && !props.forceLocalIcon) {
    const iconSrc = plIcons[props.icon as keyof typeof plIcons];
    return (
      <InlineSvg
        className={cx(className)}
        onClick={props.onClick}
        src={iconSrc}
      />
    );
  }

  const isPlImage = Object.keys(plImages).includes(props.icon);
  if ((isPlImage || props.forcePlIcon) && !props.forceLocalIcon) {
    const iconSrc = plImages[props.icon as keyof typeof plImages];
    return (
      <InlineSvg
        className={cx(className)}
        onClick={props.onClick}
        src={iconSrc}
      />
    );
  }

  return React.createElement(localIcons[props.icon as keyof typeof localIcons], {
    className,
    onClick: props.onClick,
  });

};
