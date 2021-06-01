import { MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import * as React from 'react';

/**
 * Components under this context have guaranteed a current registration selected
 */
export const RegistrationContext = React.createContext<MyaxaRegistrationItem>({} as MyaxaRegistrationItem);
