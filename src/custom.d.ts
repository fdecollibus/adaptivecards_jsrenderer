// https://webpack.js.org/guides/typescript/#importing-other-assets

declare module '*.svg' {
  /**
   * svg image as a component loaded via https://www.npmjs.com/package/react-svg-loader
   */
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  /**
   * base64-encoded string loaded via https://webpack.js.org/loaders/url-loader/
   */
  const content: string;
  export default content;
}

declare module '*.jpg' {
  /**
   * base64-encoded string loaded via https://webpack.js.org/loaders/url-loader/
   */
  const content: string;
  export default content;
}

declare module '*.gif' {
  /**
   * base64-encoded string loaded via https://webpack.js.org/loaders/url-loader/
   */
  const content: string;
  export default content;
}
