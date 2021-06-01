import * as React from 'react';
import './Body.scss';

/**
 * Displays the children within .Body
 *
 * A "dumb" component (presentational). No logic.
 */
export const Body: React.FC = ({children}) => {
  return (
    <div className={'Body'}>
      {children}
    </div>
  );
};
