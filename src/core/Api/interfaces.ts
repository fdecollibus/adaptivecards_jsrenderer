import { LANGUAGE } from '@core/Intl';
import { OnTokenOptions } from '../../interfaces';

export type RequestOptions = {
  /** current language from state */
  language: LANGUAGE,
  /** endpoint name without leading / ... e.g. 'registrations' */
  endpoint: string,
  /** token object from props */
  token?: OnTokenOptions,
  /** optional - default value is GET */
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
  apiBaseUrl: string,
  /** not allowed with GET method */
  payload?: object | string,
  /** url params that append to url */
  urlParams?: Record<string, string | number>,
  /** add custom headers to request with this prop */
  headers?: Headers | Record<string, string>,
};

export type ApiResponseType<TResponse extends object> = {
  /** response object from api call */
  response: TResponse | null;
  /** true if api call is still pending */
  loading: boolean;
  /** error information if happened */
  error: string | null;
};
