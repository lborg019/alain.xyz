import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import { gray, yellow } from 'chalk';
import * as Builder from 'systemjs-builder';

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
      warnings: true,
      globalEvaluationScope: false,
      format: 'cjs',
      typescriptOptions: {
        module: 'commonjs',
        target: 'es5',
        jsx: 'react',
        typeCheck: false,
        tsconfig: true,
        noEmitHelpers: true
      },
      packages: {
        [libname]: {
          main: 'main',
          defaultExtension: 'tsx',
          transpiler: 'plugin-typescript',
          format: 'cjs',
          typescriptOptions: {
            module: 'commonjs',
            target: 'es5',
            jsx: 'react',
            typeCheck: false,
            tsconfig: true,
            noEmitHelpers: true
          },
          externals: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'react-redux',
            'redux',
            'main'
          ],
          meta: {
            '*.js': {
              defaultExtension: 'js',
              format: 'cjs'
            },
            '*.json': {
              loader: 'json-plugin'
            },
            '*.ts': {
              loader: 'ts'
            },
            '*.tsx': {
              loader: 'ts'
            }
          }
        }
      },
      meta: {
        typescript: {
          format: 'cjs'
        },
        ts: {
          format: 'cjs'
        }
      },
      map: {
        [libname]: relativeRoot,
        'json-plugin': '@node/systemjs-plugin-json',
        ts: '@node/plugin-typescript',
        typescript: '@node/typescript',
        crypto: '@node/crypto',
        os: '@node/os',
        buffer: '@node/buffer',
        stream: '@node/stream',
        child_process: '@node/child_process',
        assert: '@node/assert',
        fs: '@node/fs',
        path: '@node/path',
        string_decoder: '@node/string_decoder',
        vm: '@node/vm',
        constants: '@node/constants',
        process: '@node/process',
        util: '@node/util',
        events: '@node/events',
        react: '@external',
        animejs: `${relativeRoot}/node_modules/animejs/anime.js`,
        'react-anime': `${relativeRoot}/node_modules/react-anime/dist/anime.js`
      }

    };

    // @TODO - Add local package.json dependencies
    /* 
    let localPackage = require(path.join(relativeRoot, 'package.json'));
    if (localPackage.dependencies) {
      let deps = Object.keys(localPackage.dependencies);
      // Get that package's package.json, get it and its dependencies recursively, put them in config.map and config.packages.
    }
    */

    console.log(`  🔨 Building Module '${libname}'\n  ... `);

    var builder = new Builder(config);

    await builder.bundle(libname, relativeRoot + '/main.js', {
      anonymous: false,
      minify: true,
      mangle: false,
      globalDefs: {
        DEBUG: false
      },
      externals: [
        'react',
        'react-dom',
        'react-router',
        'react-router-dom',
        'react-redux',
        'redux',
        'main',
        'plugin-typescript',
        'systemjs-plugin-json',
        'typescript',
        'fs',
        'path'
      ],
      runtime: false
    })
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