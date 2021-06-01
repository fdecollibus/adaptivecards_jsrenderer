import * as React from 'react';
import './TransitionDown.scss';
import cx from 'classnames';

type Props = {
  contentMaxHeight?: '200' | '400' | '600' | '800' | '1000';
};

export const TransitionDown: React.FC<Props> = ({children, contentMaxHeight = '400'}) => {
  const [active, setActive] = React.useState<boolean>(false);

  React.useEffect(
    () => setActive(true),
    [],
  );

  return (
    <div className={cx(
      'TransitionDown',
      `TransitionDown--max-height-${contentMaxHeight}`,
      `TransitionDown--${active ? 'enter-active' : 'enter'}`,
    )}>
      {children}
    </div>
  );
};
