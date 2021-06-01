import { Body } from '@components/Body';
import { Container } from '@components/Grid';
import { LoadingTile } from '@components/LoadingTile';
import { Page } from '@components/Page';
import { Spacer } from '@components/Spacer';
import * as React from 'react';

type Props = {
  title: string;
  children?: never;
};

export const Loader: React.FC<Props> = ({ title }) => (
  <Body>
    <Page>
      <Container>
        <Spacer height={54}/> {/* to match height of Link in OffersOverviewPage */}
        <LoadingTile title={title}/>
      </Container>
    </Page>
  </Body>
);
