import { IconType } from '../Icon';
import { AlertProps } from './Alert';

/**
 * Used to map alert type to icon name
 *
 * Returns icon name as string.
 */
export const getAlertIcon = (type: AlertProps['type']): IconType => {
  switch (type) {
    case 'success':
      return 'check_circle';
    case 'error':
      return 'error';
    case 'danger':
      return 'danger';
    case 'info':
    default:
      return 'info';
  }
};
