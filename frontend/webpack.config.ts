import * as path from 'path';
import { argv } from 'process';

import * as webpack from 'webpack';
import precss from 'precss';
import * as autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackSystemJSExportPlugin from 'webpack-systemjs-export-plugin';

let env = process.env['NODE_ENV'];
let isProduction = env && env.match(/production/);

let config = {
  context: path.join(__dirname, 'src'),
  entry: {
    main: 'main',
    vendor: [
      'react',
      'react-dom',
      'react-motion',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk',
      'isomorphic-fetch'
    ]
  },
  output: {
    path: path.join(__dirname, 'assets'),
    filename: '[name].min.js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }, {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader' })
    }]
  },

  postcss: [
    precss()
  ],
  plugins: [
    new ExtractTextPlugin('main.min.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.min.js'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction,
      debug: !isProduction
    }),
    new WebpackSystemJSExportPlugin()
  ]
};

if (isProduction) {
  // Production Mode
  config = {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })],
    postcss: [
      ...config.postcss,
      autoprefixer()
    ]
  };
}

/**
 * Start Build
 */
const compiler = webpack(config);

if (!argv.reduce((prev, cur) => prev || (cur === '--watch'), false)) {
  compiler.run((err, stats) => {
    if (err)
      return console.error(err);
  });
}
else {
  compiler.watch({}, (err, stats) => {
    if (err)
      return console.error(err);
  });
}