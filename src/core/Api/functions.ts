import * as React from 'react';
import { ApiResponseType, RequestOptions } from './interfaces';
import { OnTokenOptions } from '../../interfaces';

/**
 * Returns a value for the "Authorization" http header based on Token from state
 */
const makeAuthorizationHeader = (stateToken: OnTokenOptions): string | undefined => {
  const token = {
    token_type: stateToken.token_type,
    access_token: stateToken.getValidToken(),
  };
  // check whether the token object looks okay
  if (!!(token && token.token_type && token.access_token)) {
    return `${token.token_type.charAt(0).toUpperCase() + token.token_type.substr(1)} ${token.access_token}`;
  }
  return undefined;
};

/** returns request object for fetchJson fn */
export const makeRequest = (options: RequestOptions) => {
  const requestInit: RequestInit = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': options.language,
      Authorization: options.token && makeAuthorizationHeader(options.token) || '', // undefined not allowed
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.headers,
    },
    method: options.method ?? 'GET', // GET is fallback
    mode: 'cors' as 'cors',
  };

  if (options.payload && requestInit.method !== 'GET') {
    if (typeof options.payload === 'object') {
      requestInit.body = JSON.stringify(options.payload);
    } else {
      requestInit.body = options.payload.toString();
    }
  }

  let url = `${options.apiBaseUrl}${options.endpoint}`;
  if (options.urlParams) {
    const params = new URLSearchParams();
    Object.entries(options.urlParams).forEach(([key, value]) => {
      params.append(key, encodeURIComponent(value.toString()));
    });
    url = `${url}${params}`;
  }

  return new Request(url, requestInit);
};

/**
 * Function to fetch json data from our api.
 * You will get response data or error, so wrap this fn to try-catch block.
 * Use this fn, when you have to trigger api call on some event (click, submit,...) << ======= !!!! =======
 * To call api when on component init use react hook useFetchOnInit.
 */
export const fetchJson = async <TResponse extends object>(options: RequestOptions): Promise<TResponse> => {
  try {
    const res = await fetch(makeRequest(options));
    if (res.ok) {
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      } else {
        return json;
      }
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (e) {
    throw e;
  }
};

/**
 * React hook to make api calls using fetch.
 * To call api when on component init use this react hook useFetchOnInit. << ======= !!!! =======
 * To call api by trigger (click, submit,...) use function fetchJson.
 *
 * Returns:
 *  - response - is type of TResponse or null, depends on state of api call.
 *  - loading - boolean info whether api call is in progress
 *  - error - contains string if error occurred
 */
export const useFetchOnInit = <TResponse extends object>(options: RequestOptions): ApiResponseType<TResponse> => {

  const [response, setResponse] = React.useState<TResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(
    () => {
      if (options.token) {
        const doFetch = async () => {
          try {
            setLoading(true);
            const jsonResponse = await fetchJson<TResponse>(options);
            setResponse(jsonResponse);
            setLoading(false);
          } catch (e) {
            setError(e);
            setLoading(false);
          }
        };
        doFetch();
      }
    },
    [options.token],
  );

  return { response, loading, error };
};
