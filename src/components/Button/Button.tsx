import createAXAButton from '@axa-ch/button/lib/index.react';
import * as React from 'react';

/**
 * @link https://github.com/axa-ch/patterns-library/tree/develop/src/components/10-atoms/button
 */
const AXAButton = createAXAButton(React.createElement);

type Props = { seleniumId?: string } & React.ComponentProps<typeof AXAButton>;

/**
 * PL's AXAButton
 */
export const Button: React.FC<Props> = ({seleniumId, ...otherProps}) => (
    <AXAButton
        /** data-seleniumId is visible in DOM only if defined */
        data-seleniumid={seleniumId}
        {...otherProps}
    />
);
