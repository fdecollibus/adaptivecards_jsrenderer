import requireHacker from 'require-hacker';
import fs from 'fs'

/**
 * Configuration for ts-node to be to process app's source code
 *
 * Mocks out ESM dependencies, replaces lodash-es with lodash.
 */

requireHacker.hook('js', (path, module) => {

  /**
   * Replaces imports of ^@axa-ch/materials/(icons|images)/(.+)\.svg\.js$
   */
  if (path.endsWith('.svg.js')) {
    return 'module.exports = \'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M42 16.5L24.98 69m46.04 0L54 16.5M71 69c0 3.87-10.31 7-23 7s-23-3.13-23-7"/><ellipse cx="48" cy="16.5" rx="6" ry="2.5"/><path d="M27.55 61h-4.64a3 3 0 0 0-2.73 1.76l-7 16.46A2 2 0 0 0 15 82h66a2 2 0 0 0 1.84-2.78l-7-16.46A3 3 0 0 0 73.09 61h-4.67m-4.6-14.21C61.32 49.25 55.18 51 48 51s-13.33-1.74-15.82-4.21M58.38 30c-2.08 1.78-6 3-10.38 3s-8.3-1.2-10.38-3"/><path d="M68.39 60.91C65.11 63.89 57.22 66 48 66s-17.11-2.11-20.39-5.09"/></g></svg>\'';
  }

  /**
   * Replaces imports of ^@axa-ch/([^/]+)/lib/index.react$
   */
  if (path.endsWith('index.react.js')) {
    return 'const React = require("react"); module.exports = (createElement) => (props) => React.createElement(React.Fragment, null, `PL component mock: ${JSON.stringify(props)}`);';
  }

});

requireHacker.hook('png', () => 'module.exports = ""');
requireHacker.hook('scss', () => 'module.exports = ""');
requireHacker.hook('svg', () => 'module.exports = ""');

/**
 * Replaces import of 'lodash-es' with 'lodash/lodash.js'
 *
 * @todo what is cleaner way to replace lodash-es with lodash for ts-node?
 * @todo (perhaps using https://babeljs.io/docs/en/babel-register ?)
 */
requireHacker.global_hook('lodash', path => {
  if (path === 'lodash-es') {
    const source = fs.readFileSync(__dirname + '/node_modules/lodash/lodash.js').toString();
    return {source, path}
  }
});
