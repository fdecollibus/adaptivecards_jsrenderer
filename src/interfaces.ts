import { BifrostStore } from '@axa-ch/bifrost-types/lib/bifrost/BifrostStore';

/**
 * Function which returns fresh access_token
 *
 * (new Bifrost/AMUR refresh API)
 *
 * @link https://github.com/axa-ch/bifrost/pull/26/files
 */
export type AccessTokenProvider = () => string;

export type PodOptions = {
  language?: string;
  stage?: string;
  /**
   * The version of the POD which was taken from POD's package.json.
   */
  podversion: string;
  /**
   * The store is injected in the POD
   */
  store: BifrostStore;
  apiBaseUrl: string;
  clientId: string;
  /** string contains placeholder @LANG@, to be replaced with lang key (en, de, it, fr) */
  contactFormUrl: string;
  /** url to pod-myaxa */
  podMyaxaUrl: string;
};

export type OnTokenOptions = {
  token_type: 'Bearer';
  getValidToken: AccessTokenProvider;
  referrer: string;
};

/**
 * Called when there was an issue in retrieving the access token from MAAM
 * err object has following structure:
 * { error: 'error_key', error_code: 0 }
 */
export type OnFailError = {
  error: string;
  error_code: number;
};

/**
 * console.log dev-only alternative
 */
export type DevLogger = typeof console['log'];

/** helper type for optional values in API responses */
export type TypeOrNull<T> = T | null;
