import * as React from 'react';
import './NoResults.scss';
import cx from 'classnames';

type Props = {
  /**
   * Whether to display bird illustration (used when informing about No Search Results)
   */
  Illustration?: React.FC<React.SVGAttributes<SVGElement>>;
  description?: string;
  message: string;
  children?: never;
};

/**
 * NoResults
 *
 * Renders a picture of bird + provided message
 */
export const NoResults: React.FC<Props> = ({message, description, Illustration}) => {
  return (
    <div className={cx('NoResults', {'NoResults--withImg': !!Illustration})}>
      {Illustration && (
        <Illustration className={cx('NoResults__illustration')}/>
      )}
      <div className={cx('NoResults__texts')}>
        <h3 className={cx('NoResults__message')}>
          {message}
        </h3>
        {description && (
          <p className={cx('NoResults__description')}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
