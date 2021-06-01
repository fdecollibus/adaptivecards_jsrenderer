import { MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import { Body } from '@components/Body';
import { Loader } from '@components/Loader';
import { OffersContext } from './OffersContext';
import { useTranslation } from './hooks';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { NoOffersPage } from './NoOffersPage';
import { RegistrationContext } from './RegistrationContext';

export type Props = {
  /**
   * Current registration
   *
   * May arrive at a later point in time
   */
  registration: MyaxaRegistrationItem | undefined;
};

/**
 * Renders children when current registration is selected; otherwise renders NoOffersPage
 */
export const OffersAppEnv: React.FC<Props> = ({ registration, children }) => {

  const { token } = React.useContext(OffersContext);
  const t = useTranslation();
  const offersContext = React.useContext(OffersContext);

  // render loading indicator when waiting for onToken or envReady
  if (!token || !offersContext.envReady) {
    return (
      <Loader title={t('Offers.offersOverview.title')}/>
    );
  }

  // NoOffersPage page when registration is not selected
  if (!registration) {
    return (
      <Body>
        <NoOffersPage/>
      </Body>
    );
  }

  return (
    <RegistrationContext.Provider value={registration}>
      <HashRouter basename={'/'}> {/* todo: probably use 'myaxa-offers' as basename */}
        {children}
      </HashRouter>
    </RegistrationContext.Provider>
  );
};
