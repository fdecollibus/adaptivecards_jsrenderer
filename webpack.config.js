const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const config = require('config');
const fs = require('fs');
const prefixer = require('postcss-prefix-selector');
const packagejson = require('./package.json');

const babelrc = JSON.parse(fs.readFileSync(`${__dirname}/.babelrc`));
const { sep } = path;

/*-------------------------------------------------*/
const outputPath = 'lib';

// Prefix is the same as __APP_NAME_NODASH__ in midgard
// Now the CSS selector for each pod in midgard will be added. This makes sure, that each pod only uses its own CSS selectors.
const cssPrefix = `.${packagejson.name.replace('@axa-ch/', '').replace(new RegExp('-', 'g'),'')}`;


module.exports = {
  // webpack optimization mode
  mode: (process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),

  // entry file(s)
  entry: {
    // important to first build deploy so that in the library output the name
    // is matching with index.js (LIFO)
    devonly: './__mock/devonly.js',
    index: './src/index.js',
  },

  // output file(s) and chunks
  output: {
    library: 'PodAdaptiveCardsTestings',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, outputPath),
    filename: '[name].js',
    publicPath: config.get('publicPath'),
  },

  // module/loaders configuration
  module: {
    rules: [
      {
        test: /.js$/,
        include: [
          /src/,
          new RegExp(`node_modules${sep}lit-html`),
          new RegExp(`node_modules${sep}lit-element`),
          new RegExp(`node_modules${sep}@axa-ch(?!${sep}patterns-library-polyfill)`),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            ...babelrc,
          },
        },
      },
      {
        test: /.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: () => [
                prefixer({
                  prefix: cssPrefix
                })
              ]
            }
          },
          'sass-loader'
        ],
      },
      
    ],
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],

  // development server configuration
  devServer: {

    // must be true for SPAs
    historyApiFallback: true,

    // open browser on server start
    open: config.get('open'),
  },

  // generate source map
  devtool: (process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map'),
};
