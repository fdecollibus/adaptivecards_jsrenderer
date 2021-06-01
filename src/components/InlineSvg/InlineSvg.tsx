import * as React from 'react';
import InlineSVG from 'svg-inline-react';

type Props = React.SVGProps<SVGElement> & {
  /**
   * Svg markup as string
   */
  src: string;
};

/**
 * Render a SVG image given its src as string. Pass any svg element props.
 *
 * Wrapper over the 'svg-inline-react' lib
 */
export const InlineSvg: React.FC<Props> = props => (
  <InlineSVG
    raw={true}
    {...props as any} // to solve: "Types of property 'ref' are incompatible."
  />
);
