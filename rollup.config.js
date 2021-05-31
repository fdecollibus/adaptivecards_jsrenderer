// Rollup build exmaple used for UI Renderer lib build.
// This build removes all font-facees from the css, inlines scss in the final bundle and can deal with json imports

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace'); // use to setup project enviroment variables
const sass = require('rollup-plugin-sass');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const reactSvg = require('rollup-plugin-react-svg');
const autoprefixer = require('autoprefixer');
const stripFontFace = require('postcss-strip-font-face'); // strip all font faces in the bundled css
const postcss = require('postcss');
const classprefixer = require('postcss-prefix-selector');
const packagejson = require('./package.json');

const fs = require('fs');

const babelOptions = JSON.parse(fs.readFileSync('.babelrc')); // get the babelrc file

// Prefix is the same as __APP_NAME_NODASH__ in midgard 
// Now we can add the CSS selector for each pod in midgard. With that we can control that each pod only uses its own CSS selectors.
const cssPrefix = `.${packagejson.name.replace('@axa-ch/', '').replace(new RegExp('-', 'g'),'')}`;

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'es',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    json(),
    reactSvg(),
    image(),
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
      ...babelOptions,
      babelrc: false,
      exclude: [
        'node_modules/**',
      ],
      babelHelpers: 'runtime',
      // remove comments from source code
      // https://babeljs.io/docs/en/options#comments
      comments: false,
    }),
    nodeResolve({
      jsnext: true,
      module: true,
      // Do not bundle external NPM Modules, therefore exclude all imports from node_modules.
      // Reason is: Tree Shaking on Midgard. If external modules are not bundled then midgard can do tree shaking.
      // This apllies for all node_modules apart of the .scss files that are imported via CSS imports.
      // Thanks to https://github.com/rollup/rollup-plugin-node-resolve/issues/77#issuecomment-383964286
      // project files have absolute path when processed by resolve plugin
      only: [
        /^\//, // unix absolute path
        /^[A-Z]:\\/i, // windows absolute path, case insensitive
        /^\.{1,2}[/\\]/, // unix or windows relative path
        /\.scss$/i, // .scss files
      ],
    }),
  ],
};
