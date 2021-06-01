import cx from 'classnames';
import * as React from 'react';
import { Icon } from '../Icon';
import { SelfDestruct } from '../SelfDestruct';
import { TransitionDown } from '../TransitionDown';
import { Typo } from '../Typo';
import './Alert.scss';
import { getAlertIcon } from './functions';

export type AlertProps = {
  type?: 'success' | 'error' | 'info' | 'danger',
  /** turn on/off animation oninit, by default is turned on */
  animate?: boolean,
  className?: string,
  /**
   * by default Alert is always visible. add this prop to allow auto close feature.
   */
  selfDestruct?: boolean,
};

/** default value for self destruct (in ms) */
export const ALERT_SELF_DESTRUCT_TIMEOUT_MS = 5000;

/** Alert is 'dumb' component to display formatted message (info / error) and icon */
export const Alert: React.FC<AlertProps> = ({ type = 'error', animate = false, className, selfDestruct = false, children }) => {

  return (
    <AlertDestruct selfDestruct={selfDestruct} timeout={ALERT_SELF_DESTRUCT_TIMEOUT_MS}>
      <AlertAnimation animate={animate}>
        <div
          className={cx(
            'Alert',
            `Alert--${type}`,
            className,
          )}
          role="alert"
        >
          <div className={cx('Alert__icon')}>
            <Icon icon={getAlertIcon(type)} type={'functional'}/>
          </div>
          <Typo fontStyle="bold" className={cx('Alert__message')}>
            {children}
          </Typo>
        </div>
      </AlertAnimation>
    </AlertDestruct>
  );
};

const AlertAnimation: React.FC<{ animate: boolean }> = (props) => {
  if (props.animate) {
    return (
      <TransitionDown contentMaxHeight={'400'}>
        {props.children}
      </TransitionDown>
    );
  }
  return <>{props.children}</>;
};

const AlertDestruct: React.FC<{ selfDestruct: boolean, timeout: number }> = (props) => {
  if (props.selfDestruct) {
    return (
      <SelfDestruct timeoutMs={props.timeout}>
        {props.children}
      </SelfDestruct>
    );
  }
  return <>{props.children}</>;
};
