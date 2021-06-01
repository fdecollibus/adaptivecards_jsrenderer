const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace'); // use to setup project environment variables
const sass = require('rollup-plugin-sass');
const postcss = require('postcss');
const stripFontFace = require('postcss-strip-font-face'); // strip all font faces in the bundled css
const autoprefixer = require('autoprefixer');
const classprefixer = require('postcss-prefix-selector');
const alias = require('rollup-plugin-alias');
const reactSvg = require('rollup-plugin-react-svg');
const url = require('rollup-plugin-url');
const packagejson = require('./package.json');

const babelConfig = require('./babel.config');

// Prefix is the same as __APP_NAME_NODASH__ in midgard
// Now we can add the CSS selector for each pod in midgard. With that we can control that each pod only uses its own CSS selectors.
const cssPrefix = `.${packagejson.name.replace('@axa-ch/', '').replace(new RegExp('-', 'g'),'')}`;

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'es',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    sass({
      insert: true,
      include: ['**/*.scss'],
      options: {
        includePaths: [
          'node_modules',
        ],
      },
      processor: css => postcss([autoprefixer, stripFontFace])
        .use(
          classprefixer({
            prefix: cssPrefix,
            exclude: ['body']
          })
        )
        .process(css)
        .then(result => result.css),
    }),
    babel({
      ...babelConfig,
      // remove comments from source code
      // https://babeljs.io/docs/en/options#comments
      comments: false,
      // rollup-plugin-babel -only config options:
      // https://github.com/rollup/rollup-plugin-babel#programmatic
      extensions: ['.ts', '.tsx', '.svg'],
      exclude: ['node_modules/**'],
      runtimeHelpers: true,
    }),
    // not needed (no imports of .json files)
    // json(),
    reactSvg({
      jsx: true,
      svgo: {
        plugins: [{removeViewBox: false}],
        floatPrecision: 2,
      },
    }),
    // import images as inlined base64-encoded strings
    // https://github.com/rollup/rollup-plugin-url
    url({
      limit: 1024 * 1024 * 1024, // infinite
    }),
    resolve({
      // threat all node_modules as external apart of .scss files
      // project files have absolute path when processed by resolve plugin
      only: [
        /^\//, // unix absolute path
        /^[a-z]:\\/i, // windows absolute path, case in-sensitive
        /^\.{1,2}[/\\]/, // unix or windows relative path
        /\.scss$/i, // scss in axa-ch/patterns-library-v1
      ],
      extensions: ['.ts', '.tsx'],
    }),
    // https://github.com/rollup/rollup-plugin-alias
    alias({
      resolve: ['.tsx', '.ts', '/index.ts', '.svg', '.png', '.jpg'],
      entries: [
        {
          find: /^@assets/, replacement: path.resolve(__dirname, 'assets'),
        },
        {
          find: /^@(components|core|features)/, replacement: path.resolve(__dirname, 'src/$1'),
        }
      ],
    }),
  ].filter(Boolean),
};
