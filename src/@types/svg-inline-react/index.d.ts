declare module 'svg-inline-react' {
  import React from 'react';
  export default class InlineSVG extends React.Component<React.SVGProps<SVGElement> & { src: string, raw?: boolean }> {
  }
}
