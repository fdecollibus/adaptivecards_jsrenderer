import * as React from 'react';
import cx from 'classnames';

import './LoadingSpinner.scss';

type Props = {
  /** truthy value displays loading spinner; falsy value hides loading spinner */
  isLoading?: boolean;
  /** make background visible */
  backdrop?: boolean;
  /** for global spinner, because it's first rendered element so we apply class on it to maintain min height */
  isGlobal?: boolean;
};

/**
 * LoadingSpinner is component with loop animation (HTML + CSS)
 * - component wraps children and display animation if isLoading prop is truthy
 */
export const LoadingSpinner: React.FC<Props> = (props) => {
  return (
    <div className={cx('LoadingSpinner', {'LoadingSpinner--global': props.isGlobal})}>
      {!!props.isLoading && (
        <div
          className={cx(
            'LoadingSpinner__backdrop',
            {
              'LoadingSpinner__backdrop--visible': props.backdrop,
            },
          )}
        >
          <div className={cx('LoadingSpinner__spinner')}></div>
        </div>
      )}
      <div className={cx('LoadingSpinner__content')}>
        {props.children}
      </div>
    </div>
  );
};

LoadingSpinner.defaultProps = {
  backdrop: false,
};
