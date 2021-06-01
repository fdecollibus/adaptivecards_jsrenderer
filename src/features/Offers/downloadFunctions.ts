/**
 * Functions and interfaces taken from myaxa-fe with minimal changes
 *
 * Exported functions:
 * - downloadPdsDocument()
 * - navigateToFileByDokIdEcm()
 *
 * API Response for public-document-store service
 * api: '/rest/pds-document/v1/documents/'
 * ConfluencePage https://confluence.axa.com/confluence/pages/viewpage.action?pageId=95109404
 */

import { makeRequest } from '@core/Api/functions';
import { LANGUAGE } from '@core/Intl';
import { OnTokenOptions } from '../../interfaces';

enum PDS_DOCUMENTS_ERROR_CODES {
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
  DOCUMENT_FOR_LANGUAGE_NOT_FOUND = 'DOCUMENT_FOR_LANGUAGE_NOT_FOUND',
  TECHNICAL_PROBLEM = 'TECHNICAL_PROBLEM',
}

interface LoadPdsDocumentResult {
  loading: boolean;
  error: boolean;
  errorMessageKey?: string;
}

interface PdsDocumentErrorResponse {
  error: {
    code: string;
  };
}

interface PdsDocumentMeta {
  /**
   * for url path: `${config.ContractDetail.publicDocumentStoreUrl}/{$accessCode}`
   */
  accessCode?: string;
  /**
   * for query string: `?code=${code}`
   */
  code?: string;
  /**
   * for query string: `?dokId=${dokId}&language=${language}`
   */
  dokId?: number;
  /**
   * for query string: `?dokId=${dokId}&language=${language}`
   */
  language?: LANGUAGE;
}

/**
 * if isMobileAppleDevice and success, returns new opened Window, otherwise returns null
 *
 * We want to open new tabs (windows) for iPad/iPhone, see:
 * https://jira.axa.com/jira/browse/MYAXATA-8653
 */
const getNewWindowMobileApple = (): Window | null => {
  if (isMobileAppleDevice()) {
    return window.open('about:blank', '', 'toolbar=0, width=400, height=200, resizable=1');
  }
  return null;
};

const isMobileAppleDevice = () => {
  return window.navigator.userAgent.match(/iPhone|iPad/i);
};

const isChromeOnAppleDevice = () => {
  return window.navigator.userAgent.match(/CriOS/i);
};

/**
 * extract filename from content-disposition header. Header-Example: attachment; filename="MF_AVB_06.2011_DE.pdf"
 * @param contentDispositionHeader
 */
const extractFilename = (contentDispositionHeader: string | null): string => {
  if (contentDispositionHeader) {
    const matcherResult = contentDispositionHeader.match(/^[^"]*"([^"]*)*"/i);
    if (matcherResult && matcherResult[1]) {
      return matcherResult[1];
    }
  }
  // use Document.pdf as fallback if name is not provided
  return 'Document.pdf';
};

/**
 * Prepare blob and provide it to user as pdf download for different browser/os types
 * @param filename predefined filename for download
 * @param blob document as blob
 * @param maybeNewWindow reference to new window or null (used for apple/mobile)
 */
const provideBlobAsDownload = (filename: string, blob: Blob, maybeNewWindow: Window | null) => {
  interface HTMLElementWithDownload extends HTMLElement {
    download: any;
  }

  const aTag: HTMLElementWithDownload = document.createElement('a');

  // special case for Internet Explorer and MS Edge
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);

    // special case for Chrome on iOS Devices
  } else if (isChromeOnAppleDevice()) {
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      window.location.href = String(reader.result);
    };
    reader.readAsDataURL(blob);

    // If browser does not support download attribute on "a" tag
  } else if (typeof aTag.download === 'undefined') {
    window.location.href = URL.createObjectURL(blob);

    // default case can be used for chrome and MS Edge
    // details for following implementation here: https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
  } else {
    const blobUrl: string = URL.createObjectURL(blob);
    if (maybeNewWindow) {
      maybeNewWindow.location.replace(blobUrl);
    } else {
      aTag.setAttribute('href', blobUrl);
      aTag.setAttribute('download', filename);
      /*
       * target attribute needed to open document in new tab or download dialog because of GTM issue:
       * https://stackoverflow.com/questions/62828321/google-tag-manager-breaks-download-attribute-on-a-tag
       */
      aTag.setAttribute('target', '_blank');
      document.body.appendChild(aTag);
      aTag.click();
    }
  }
};

/**
 * Extract error message from response and translate to user-friendly message key
 * @param response rest service response
 */
const handleLoadPdsDocumentError = (response: Response) => {
  return response.json()
    .then((jsonResponse: PdsDocumentErrorResponse) => {
      const loadDocumentResponse: LoadPdsDocumentResult = {
        error: true,
        loading: false,
      };

      // determine error text according to error code in response
      switch (jsonResponse?.error?.code) {
        case PDS_DOCUMENTS_ERROR_CODES.DOCUMENT_NOT_FOUND:
          loadDocumentResponse.errorMessageKey = 'Offers.offersDocumentNotFound.label';
          break;
        case PDS_DOCUMENTS_ERROR_CODES.DOCUMENT_FOR_LANGUAGE_NOT_FOUND:
          loadDocumentResponse.errorMessageKey = 'Offers.offersDocumentLangNotFound.label';
          break;
        case PDS_DOCUMENTS_ERROR_CODES.TECHNICAL_PROBLEM: // same as default
        default:
          loadDocumentResponse.errorMessageKey = 'Offers.offersDocumentOtherError.label';
      }

      return loadDocumentResponse;
    })
    // catch json parse exception
    .catch((e) => {
      return Promise.resolve({
        error: true,
        errorMessageKey: 'Offers.offersDocumentOtherError.label',
        loading: false,
      });
    });
};

const fetchDocumentFromPdsDocumentApi = (requestInfo: Request, requestInit: RequestInit): Promise<LoadPdsDocumentResult> => {

  // window.open() calls are blocked, unless created in main event thread.
  // So creating it in advance here.
  const maybeNewWindow = getNewWindowMobileApple(); // used for mobile/apple only

  return fetch(requestInfo, requestInit)
    .then((response: Response) => {
      const filename = extractFilename(response.headers.get('content-disposition'));

      if (response.status === 404 || response.status === 503) {
        return handleLoadPdsDocumentError(response);
      }

      return response.blob().then((blob: Blob) => {
        provideBlobAsDownload(filename, blob, maybeNewWindow);
        return {
          error: false,
          loading: false,
        };
      });
    })
    // catch fetch's "Failed to fetch" network exception
    .catch((e) => {
      if (maybeNewWindow) {
        maybeNewWindow.close();
      }
      return Promise.resolve({
        error: true,
        errorMessageKey: 'Offers.offersDocumentOtherError.label',
        loading: false,
      });
    });
};

/**
 * Returns query string based on PdsDocumentMeta OR empty string if none of code/dokId/language is present in PdsDocumentMeta
 */
const getPublicDocumentQueryString = ({ code, dokId, language }: PdsDocumentMeta) => {
  let urlQueryString = '';
  if (code) {
    // search by access code
    urlQueryString = `?code=${code}`;
  } else if (dokId) {
    // search by document id and language
    urlQueryString = `?dokId=${dokId}&language=${language}`;
  }
  return urlQueryString;
};

/**
 * Returns postfix for publicDocumentStoreUrl based on PdsDocumentMeta.accessCode
 *
 * Returns empty string if PdsDocumentMeta.accessCode is not present in PdsDocumentMeta
 */
const getPublicDocumentPath = ({ accessCode }: PdsDocumentMeta) => accessCode ? '/' + accessCode : '';

/**
 * Arguments for downloadPdsDocument() grouped together, because flow down thru a bunch of functions
 */
type DownloadHandlers = {
  // config: AppConfig;
  /**
   * Callback to turn on/off the loading indicator.
   *
   * Gets set to true during downloading.
   */
  setLoading: (isLoading: boolean) => void;
  /**
   * Callback to SET or RESET (=undefined) the download error message lng key.
   *
   * On download attempt the error is reset. If download fails, it is set to a error message lng key.
   */
  setErrorLngKey: (error: string | undefined) => void;
};

export const downloadPdsDocument = (
  pdsDocumentMeta: PdsDocumentMeta, apiBaseUrl: string, clientId: string, handlers: DownloadHandlers,
): void => {
  const publicDocumentStoreUrl = '/rest/pds-document/v1/documents';

  const pdsDocumentApiUrl = publicDocumentStoreUrl
    + getPublicDocumentPath(pdsDocumentMeta)
    + getPublicDocumentQueryString(pdsDocumentMeta);

  const requestInfo: RequestInfo = makeRequest({
    // no authorization is needed for PdsDocumentApi_1 service, just a api key has to be provided
    language: pdsDocumentMeta.language || 'de',
    apiBaseUrl,
    endpoint: pdsDocumentApiUrl,
  });

  const requestInit: RequestInit = {
    headers: { 'X-AXA-APIKey': clientId },
    method: 'GET',
    mode: 'cors' as 'cors',
  };

  handlers.setErrorLngKey(undefined); // reset any previous error
  handlers.setLoading(true);

  fetchDocumentFromPdsDocumentApi(requestInfo, requestInit).then((result) => {
    handlers.setLoading(false);

    if (result.error && result.errorMessageKey) {
      handlers.setErrorLngKey(result.errorMessageKey);
    }
  });

};

/**
 * Downloads document using dokIdEcm
 *
 * When error happens, calls setErrorLngKey()
 */
export const navigateToFileByDokIdEcm = (
  dokIdEcm: string,
  currentLang: LANGUAGE,
  apiBaseUrl: string,
  token: OnTokenOptions,
  handlers: DownloadHandlers,
): void => {

  handlers.setErrorLngKey(undefined); // reset any previous error
  handlers.setLoading(true);

  // window.open() calls are blocked, unless created in main event thread.
  // So creating it in advance here.
  const maybeNewWindow = getNewWindowMobileApple(); // used for mobile/apple only

  // handle any error happening below in code
  const handleError = () => {
    handlers.setErrorLngKey('Offers.offersDocumentOtherError.label');
    handlers.setLoading(false);
    if (maybeNewWindow) {
      maybeNewWindow.close();
    }
  };

  const documentsEndpoint = '/rest/po/document/v2/documents';
  const dokTypeEcm = 1002; // same for all offers documents

  const requestInfo: RequestInfo = makeRequest({
    token,
    language: currentLang,
    apiBaseUrl,
    endpoint: `${documentsEndpoint}/${encodeURIComponent(JSON.stringify({ dokIdEcm, dokTypeEcm }))}`,
  });

  fetch(requestInfo)
    .then((response) => {
      handlers.setLoading(false);

      switch (response.status) {
        // case Api.SUCCESS_CODES.OK:
        case 200:
          // one document found
          const filename = extractFilename(response.headers.get('content-disposition'));
          response.blob()
            .then((blob: Blob) => provideBlobAsDownload(filename, blob, maybeNewWindow))
            .catch(() => {
              if (maybeNewWindow) {
                maybeNewWindow.close();
              }
              handleError();
            });
          break;
        // case Api.ERROR_CODES.NOT_FOUND:
        case 404:
          // none or multiple documents found
          handleError();
          if (maybeNewWindow) {
            maybeNewWindow.close();
          }
          break;
        default:
          // no document found
          handleError();
          break;
      }

    })
    .catch(handleError); // network error (offline)

};
