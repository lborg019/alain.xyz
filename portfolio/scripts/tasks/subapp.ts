import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import * as Builder from 'systemjs-builder';

import { database } from '../../../backend/src/db';
import { makePermalink } from './misc';


export default async function compileSubapp() {

  console.log('~~ SubApp Compiler ~~');

  // Query root folders in portfolio for their /main.tsx?$/ file.
  let root = path.join(__dirname, '..', '..');
  let subapps = find.fileSync(/\main\.tsx?$/, root);

  // Compile them under the module name alain-xyz/{foldername}
  for (var subapp of subapps) {

    let subappjs = subapp.replace(/\.tsx?$/, '.js');
    let newRoot = path.join(subappjs, '..');
    let relativeRoot = path.relative(root, newRoot);
    let libname = path.join('alain-xyz-portfolio', relativeRoot).replace(/\\/g, '/');

    let config = {
      globalEvaluationScope: false,
      baseURL: './',
      format: "commonjs",
      defaultJSExtensions: true,
      typescriptOptions: {
        module: "system",
        target: "es5",
        jsx: "react",
        typeCheck: false,
        tsconfig: true
      },
      packages: {
        [libname]: {
          main: 'main',
          defaultExtension: "tsx",
          transpiler: "ts",
          format: "system",
          typescriptOptions: {
            module: "system",
            target: "es5",
            jsx: "react",
            typeCheck: false,
            tsconfig: true
          },
          externals: [
            'react',
            'react-dom',
            'react-router',
            'react-redux',
            'redux',
            'alain-xyz'
          ],
          meta: {
            "*.ts": {
              "loader": "ts"
            },
            "*.tsx": {
              "loader": "ts"
            }
          }
        }
      },
      meta: {
        typescript: {
          format: 'cjs'
        },
        ts: {
          format: 'register'
        }
      },
      packageConfigPaths: [
        "github:*/*.json",
        "npm:@*/*.json",
        "npm:*.json"
      ],
      paths: {
        "github:": "jspm_packages/github/",
        "npm:": "jspm_packages/npm/"
      },
      map: {
        [libname]: relativeRoot,
        ts: '@node/plugin-typescript',
        typescript: '@node/typescript',
        crypto: "@node/crypto",
        os: "@node/os",
        buffer: "@node/buffer",
        stream: "@node/stream",
        child_process: "@node/child_process",
        assert: "@node/assert",
        fs: "@node/fs",
        path: "@node/path",
        string_decoder: "@node/string_decoder",
        vm: "@node/vm",
        constants: "@node/constants",
        process: "@node/process",
        util: "@node/util",
        events: "@node/events"
      }

    };

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
        'react-redux',
        'redux',
        'alain-xyz',
        'plugin-typescript',
        'typescript',
        'fs',
        'path'
      ],
      runtime: false
    })
      .then(res => console.log('Bundle Complete'))
      .catch(err => console.error(err));


    //index them according to their folder name. 
    await database.then(db => {
      var filesCollection = db.collection('files');
      var p = '/' + path.relative(root, subappjs).replace(/\\/g, '/');
      filesCollection.update({ file: subappjs }, { file: subappjs, permalink: p }, { upsert: true });
      console.log(`\nPlacing the file: \nfile: ${subappjs}\npermalink: ${p}\n`);
    });
  }
}