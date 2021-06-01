import Robot from '@assets/robot.svg';
import { Heading } from '@components/Heading';
import * as React from 'react';
import './ErrorMessage.scss';
import cx from 'classnames';

interface Props {
  /**
   * Main title of error
   *
   * Example: Verträge nicht gefunden
   */
  title: string;
  /**
   * Some message (description) text - secondary text under title
   *
   * Example: Die angeforderte Seite konnte leider nicht gefunden werden.
   */
  message?: string | JSX.Element;
  /**
   * We can add error code or name, formatted string above title
   *
   * Example: 404 Fehler
   */
  errorCode?: string;

  httpErrorCode?: number;
  /**
   * Whether to display an Robot image left to the `message`.
   */
  illustration?: boolean;
  /**
   * Will be displayed on the bottom
   *
   * Example: buttons/link/error details
   */
  children?: React.ReactNode;
  /**
   * Pass a custom image instead of using the default Robot
   */
  Image?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

/**
 * Component to format error title and message to have all error messages same styles across whole app
 *
 * Design as on link below, but black on white.
 *
 * @link https://www.figma.com/file/xWIwaTmIwg7NNveqnIyNxD/Fehlerseiten?node-id=3%3A22
 */
export const ErrorMessage: React.FC<Props> = ({title, Image = Robot, message, errorCode, illustration, children}) => {
  return (
    <article className={cx('ErrorMessage', {
      'ErrorMessage--illustration': illustration,
    })}>
      {errorCode && <p className={cx('ErrorMessage__errorCode')}>{errorCode}</p>}

      <Heading className={cx('ErrorMessage__Heading')} variant="secondary" rank={2}>
        {title}
      </Heading>

      <div className={cx('ErrorMessage__cols')}>
        {illustration && (
          <div className={cx('ErrorMessage__illustration')}>
            <Image/>
          </div>
        )}
        {message && <div className={cx('ErrorMessage__message')}>{message}</div>}
      </div>

      {children && <div className={cx('ErrorMessage__children')}>{children}</div>}
    </article>
  );
};
