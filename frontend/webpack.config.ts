import * as path from 'path';
import { argv } from 'process';

import * as webpack from 'webpack';
import * as precss from 'precss';
import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
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
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'es2015'
          }
        }
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              options: {
                modules: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // sourceMap: true,
                postcss: () => [
                  precss(),
                  autoprefixer({
                    browsers: [
                      'last 3 version',
                      'ie >= 10',
                    ],
                  })
                ]
              }
            }
          ]
        })
      }
    ]
  },


  plugins: [
    new ExtractTextPlugin('main.min.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.min.js'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction,
      debug: !isProduction,
      postcss: [
        precss(),
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        })
      ]
    }),
    new WebpackSystemJSExportPlugin({
      public: [
        'react',
        'react-dom',
        'react-motion',
        'react-redux',
        'react-router',
        'redux',
        'redux-thunk',
        'isomorphic-fetch'
      ]
    })
  ]
};

if (isProduction) {
  // Production Mode
  config = {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.optimize.UglifyJsPlugin({
        minimize: true
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })]
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