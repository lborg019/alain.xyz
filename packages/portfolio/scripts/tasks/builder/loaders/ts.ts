import { gray } from 'chalk';
import * as webpack from 'webpack';
import * as WebpackSystemRegister from 'webpack-system-register';
import { exec } from 'child_process';
import { statSync } from 'fs';
import { join } from 'path';
import { database } from '../../../../../backend/src/db';

export const ts = {
  test: {
    main: /\.tsx?$/
  },
  loader: async (foil) => {

    let file = join(foil.package, '..', foil.main);

    // New permalink to main file.
    let newMain = join(foil.permalink, foil.main.replace(/\.tsx?$/, '.js')).replace('\\', '/');;

    // Check if main file has been updated or never existed.
    let updated = checkUpdated(file);

    if (updated) {

      let { dependencies, devDependencies } = require(foil.package);
      if (dependencies || devDependencies) {
        // Update dependencies through `npm i`
        await installDependencies(join(file, '..'));
      }
      // Compile module with Webpack
      await compile(file, foil.title);

      // Update in Database
      await updateInDatabase(file, newMain);

      let newFoil = {
        ...foil,
        main: newMain
      };

      return newFoil;
    }
    else
      return foil;
  }
}



/**
 * Checks the database to see if the file exists or has been updated.
 * If it doesn't exist, or its been updated, return true.
 * @param path The absolute path to the file.
 */
async function checkUpdated(path: string) {
  return await database.then(async db => {

    // Check redirect collection to see if file at path exists.
    let collection = db.collection('redirect');

    let foundItems = await collection.find({
      from: path
    })
      .limit(1)
      .toArray();

    if (typeof foundItems !== 'object' || foundItems.length < 1)
      return true;
    else {
      // Compare dates
      var { mtime } = statSync(path);
      return mtime.getDate() === new Date(foundItems[0].dateModified).getDate();
    }
  })
}

/**
 * Downloads dependencies with yarn. 
 * @param path absolute path to folder of JavaScript file.
 */
function installDependencies(path: string) {
  console.log('installing')
  // Run yarn, install local node_modules
  return new Promise((res, rej) => {
    exec('npm i --prefix ' + path, (err, stdout, stderr) => {
      console.log('installing at %s', path);
      if (err || stderr)
        rej(err || stderr);
      else
        res(stdout);
    })
  });
}

/**
 * Compile foil module with Webpack.
 */
function compile(root: string, title: string) {
  console.log('compile');
  let config = {
    context: root, // @TODO - Consider using file folder
    entry: {
      main: './main'
    },
    output: {
      path: root,
      filename: 'main.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [
        root,
        join(root, 'node_modules'),
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

  console.log(`  🔨 Building Module '${title}'\n  ... `);

  var compiler = webpack(config);

  return new Promise<any>((res, rej) =>
    compiler.run((err, stats) => {
      if (err)
        rej(err);
      else
        res(stats);
    }))
    .then(res => console.log('  Done!\n'))
    .catch(err => console.error(err));
}

/**
 * Updates the file in the database.
 * @param file absolute file path of module.
 * @param path website path.
 */
function updateInDatabase(file: string, permalink: string) {
  //index them according to their folder name. 
  return database
    .then(db => {
      var filesCollection = db.collection('redirect');

      let query = {
        to: permalink
      };

      let update = {
        to: permalink,
        from: file,
        dateModified: statSync(file).mtime
      };

      let options = {
        upsert: true
      };

      filesCollection.update(
        query,
        update,
        options);

      console.log(gray(`    Indexing Build: \n    file: ${file}\n    permalink: ${permalink}\n`));
    });
}