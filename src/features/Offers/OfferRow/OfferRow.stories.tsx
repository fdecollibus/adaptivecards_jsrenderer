import { OfferRow } from './OfferRow';
import * as React from 'react';

// const StatefullOfferRow: typeof OfferRow = (props) => {
const StatefullOfferRow: React.FC<Omit<React.ComponentProps<typeof OfferRow>, 'onChange'>> = (props) => {
  const [selected, setSelected] = React.useState(props.selected);
  return (
    <OfferRow
      {...props}
      selected={selected}
      onChange={() => setSelected(!selected)}
    />
  );
};

/**
 * Showcase of OfferRow component
 */
export const OfferRowStories: React.FC = () => {
  return (

    <div style={{ padding: 20, margin: '20px 0', backgroundColor: 'white' }}>
      not recommended:
      <StatefullOfferRow
        selected={false}
        icon={'car'}
        // title={'Variante #0'}
        description={'Variante #1 Teilkasko'}
        amount={1197.20}
        currency={'CHF'}
        detailPathname={'#'}
        recommendedBy={undefined}
        booked={false}
      />
      default:
      <StatefullOfferRow
        selected={false}
        icon={'car'}
        // title={'Variante #1'}
        description={'Variante #2 Teilkasko'}
        amount={1197.20}
        currency={'CHF'}
        detailPathname={'#'}
        recommendedBy={'Joe Doe'}
        booked={false}
      />
      selected:
      <StatefullOfferRow
        selected={true}
        icon={'car'}
        // title={'Variante #2'}
        description={'Variante #3 Teilkasko'}
        amount={860.20}
        currency={'CHF'}
        detailPathname={'#'}
        recommendedBy={'Recommended Name'}
        booked={false}
      />
      booked:
      <StatefullOfferRow
        selected={false}
        icon={'car'}
        title={'Motorfahrzeugversicherung, ZH 123456'}
        description={'Variante #1 Vollkasko'}
        amount={450.80}
        currency={'CHF'}
        detailPathname={'#'}
        recommendedBy={'Recommended Name'}
        booked={true}
        stateKey={'2'}
      />
      <StatefullOfferRow
        selected={false}
        icon={'car'}
        title={'Motorfahrzeugversicherung, ZH 123456'}
        description={'Variante #1 Vollkasko'}
        amount={450.80}
        currency={'CHF'}
        detailPathname={'#'}
        recommendedBy={'Recommended Name'}
        booked={true}
        stateKey={'1'}
      />

    </div>
  );
};
