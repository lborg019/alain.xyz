import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import { gray, yellow } from 'chalk';
import * as webpack from 'webpack';
import * as WebpackSystemRegister from 'webpack-system-register';

import { database } from '../../../backend/src/db';
import { makePermalink } from './misc';


async function compileSubapp() {

  console.log(`📦 ${yellow('Alain.xyz SubApp Compiler')}\n`);

  // Query root folders in portfolio for their /main.tsx?$/ file.
  let root = path.join(__dirname, '..', '..');
  let subapps = find.fileSync(/\main\.tsx?$/, root).filter(v => !v.match(/node_modules/));

  // Compile them under the module name alain-xyz/{foldername}
  for (var subapp of subapps) {

    let subappjs = subapp.replace(/\.tsx?$/, '.js');
    let newRoot = path.join(subappjs, '..');
    let relativeRoot = path.relative(root, newRoot);
    let libname = path.join('alainxyz-subapp', relativeRoot).replace(/\\/g, '-');

    let config = {
      context: newRoot,
      entry: {
        main: './main'
      },
      output: {
        path: newRoot,
        filename: 'main.js'
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
          newRoot,
          path.join(newRoot, 'node_modules'),
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
          }
        ]
      },


      plugins: [
        new WebpackSystemRegister({
          systemjsDeps: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'react-redux',
            'redux',
            'main',
          ]
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })]
    };

    console.log(`  🔨 Building Module '${libname}'\n  ... `);

    var compiler = webpack(config);

    await new Promise<any>((res, rej) => compiler.run((err, stats) => {
      if (err)
        rej(err);
      else
        res(stats);
    }))
      .then(res => console.log('  Done!\n'))
      .catch(err => console.error(err));


    //index them according to their folder name. 
    await database
      .then(db => {
        var filesCollection = db.collection('redirect');
        var p = '/' + path.relative(root, subappjs).replace(/\\/g, '/');
        filesCollection.update({ file: subappjs }, { to: subappjs, from: p }, { upsert: true });
        console.log(gray(`    Indexing Build: \n    file: ${subappjs}\n    permalink: ${p}\n`));
      });
  }
}

export { compileSubapp };