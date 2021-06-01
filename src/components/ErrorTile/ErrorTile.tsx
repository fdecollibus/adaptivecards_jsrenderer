import { ErrorMessage } from '../ErrorMessage';
import { Tile, TileProps } from '../Tile';
import * as React from 'react';
import cx from 'classnames';
import './ErrorTile.scss';

type Props = React.ComponentProps<typeof ErrorMessage> & {
  anchorNavId?: TileProps['anchorNavId'],
};

/**
 * The `illustration` prop defaults to true
 */
export const ErrorTile: React.FC<Props> = ({anchorNavId, illustration, ...errorMessageProps}) => {

  return (
    <Tile className={cx('ErrorTile')} anchorNavId={anchorNavId}>
      <ErrorMessage
        illustration={illustration ?? true}
        {...errorMessageProps}
      />
    </Tile>
  );
};
