import { AXAButtonProps } from '@axa-ch/button/lib/index.react';
import cx from 'classnames';
import * as React from 'react';
import { AnyFunction } from '../../types';
import { Badge } from '../Badge';
import { BadgePropTypes } from '../Badge/Badge';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import './TileHeader.scss';

export type TileHeaderProps = {
  badge?: BadgePropTypes;
  /** h2 heading of section(Tile) */
  title?: string | React.ReactElement;
  /** h3 heading of section(Tile) */
  subTitle?: string | React.ReactElement;
  /** label of button placed in header part of Tile */
  headerButtonLabel?: string;
  headerButtonIcon?: AXAButtonProps['icon'];
  /** function executed on headerButton click  */
  headerButtonOnClick?: AnyFunction;
  /** href to navigate on cross-icon click  */
  onCloseHref?: string;
  /** optional prop to pass seleniumId into header button */
  headerButtonSeleniumId?: string;
};

/** TileHeader handles displaying and styling of title (h2) and button in header area of Tile */
export const TileHeader: React.FC<TileHeaderProps> =
  ({badge, title, subTitle, headerButtonLabel, headerButtonIcon = 'add', headerButtonOnClick, onCloseHref, headerButtonSeleniumId}) => {

    if (!title && !headerButtonLabel) return null;

    return (
      <>
        <div className={cx('TileHeader')}>
          <div className={cx('TileHeaderMain')}>
            <div className={cx('TileHeaderMain__titles')}>
              {title && (
                <Heading
                  className={cx('TileHeaderMain__title')}
                  rank={3}
                  variant={'secondary'}
                >
                  {title}
                  {badge && <Badge {...badge}/>}
                </Heading>
              )}
              {subTitle && <h3 className={cx('TileHeaderMain__subTitle')}>{subTitle}</h3>}
            </div>
            {headerButtonLabel && (
              <div className={cx('TileHeaderMain__button')}>
                <Button
                  onClick={headerButtonOnClick}
                  icon={headerButtonIcon}
                  seleniumId={headerButtonSeleniumId}
                >
                  {headerButtonLabel}
                </Button>
              </div>
            )}
            {onCloseHref && (
              <a href={onCloseHref} className={cx('TileHeaderMain__closeIconCol')}>
                <Icon icon="cross-gap"/>
              </a>
            )}
          </div>
        </div>
      </>
    );
  };
