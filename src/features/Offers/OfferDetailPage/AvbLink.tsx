import { Spacer } from '@components/Spacer';
import { useFetchOnInit } from '@core/Api';
import { AvbPropertiesResponse } from '@features/Offers';
import { OffersContext } from '@features/Offers/OffersContext';
import * as React from 'react';
import { Link } from '@components/Link';
import Skeleton from 'react-loading-skeleton';

type AvbLinksProps = {
  /* pubDocId - comes from offer.avbDocuments item */
  avbDocId: number;
  /* for fallback text where we display `AVB ${index}`*/
  index: number;
  /* fn to download file */
  onDownload: (avbDocId: number) => void;
  className?: string;
};

/**
 * Component is responsible for Link rendering.
 * Link label comes from BE service.
 *
 * Component has 3 states:
 * - loading - as placeholder we render Skeleton component (instead of Link)
 * - success - Link component is rendered with fetched label
 * - error - because api call failed, we render Link with fallback label 'AVB' (for every langugage)
 */
export const AvbLink: React.FC<AvbLinksProps> = ({ avbDocId, onDownload, index, className }) => {

  const FALLBACK_TEXT = `AVB ${index + 1}`;

  const offersContextConsumer = React.useContext(OffersContext);

  const { response, loading } = useFetchOnInit<AvbPropertiesResponse>({
    token: offersContextConsumer.token,
    apiBaseUrl: offersContextConsumer.apiBaseUrl,
    endpoint: `/rest/pds-document/v1/documents/properties?dokId=${avbDocId}&language=${offersContextConsumer.language}`,
    language: offersContextConsumer.language,
    headers: {
      'X-AXA-APIKey': offersContextConsumer.clientId,
    },
  });

  if (loading) {
    return (
      <>
        <Spacer height={2}/>
        <Skeleton height={'21px'} width={'60%'}/>
        <Spacer height={16}/>
      </>
    );
  }
  return (
    <Link
      key={avbDocId}
      icon={'download'}
      variant={'icon'}
      onClick={() => onDownload(avbDocId)}
      className={className}
    >
      {response?.list?.[0]?.dokTypCdomsBez ?? FALLBACK_TEXT}
    </Link>
  );
};
