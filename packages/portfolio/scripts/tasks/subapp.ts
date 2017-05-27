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
      format: 'commonjs',
      typescriptOptions: {
        module: 'system',
        target: 'es5',
        jsx: 'react',
        typeCheck: false,
        tsconfig: true
      },
      packages: {
        [libname]: {
          main: 'main',
          defaultExtension: 'tsx',
          transpiler: 'plugin-typescript',
          format: 'system',
          typescriptOptions: {
            module: 'system',
            target: 'es5',
            jsx: 'react',
            typeCheck: false,
            tsconfig: true
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
            '*.ts': {
              'loader': 'ts'
            },
            '*.tsx': {
              'loader': 'ts'
            }
          }
        }
      },
      meta: {
        typescript: {
          format: 'cjs'
        },
        ts: {
          format: 'systemjs'
        }
      },
      map: {
        [libname]: relativeRoot,
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
        events: '@node/events'
      }

    };

    console.log(`  🔨 Building Module '${libname}'\n  ... `);

    var builder = new Builder(config);

    await builder.bundle(libname, relativeRoot + '/main.js', {
      anonymous: true,
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