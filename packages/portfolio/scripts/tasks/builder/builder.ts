import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import { yellow } from 'chalk';

import { getAsset, makePermalink, checkIfModified, writeToDb } from './utils';
export type Loader = any;

// Root of portfolio module
const ROOT = path.join(__dirname, '..', '..', '..');

/**
 * Executes Alain.xyz's Package building system.
 * @param loaders An array of Loaders.
 */
export default async function builder(loaders: Loader[]) {

  console.log('🌟 ' + yellow('Alain.xyz Package Builder\n'));

  // Find all package.json files
  let packages = find.fileSync(/\package.json$/, ROOT);
  packages = packages.filter(cur => !cur.match(/node_modules/))

  for (var pack of packages) {

    // Import package.json and set some defaults
    let {
      name: permalink,
      main: file = "index.md",
      description = '',
      author = "Alain Galvan",
      keywords = [],
      foil
    } = require(pack);

    // If it's a foil module, compile it with loaders
    if (foil) {

      let {
        main,
        title,
        datePublished,
        image,
        data
      } = foil;

      // Check with database if the file has been modified.
      let filePath = path.join(pack, '..', file);

      if (!fs.statSync(filePath).isDirectory()) {

        let img = getAsset(filePath, permalink);
        let icon = getAsset(filePath, permalink, 'icon');

        let foilModule = {
          ...foil,
          title,
          description,
          keywords,
          datePublished: new Date(datePublished),
          dateModified: fs.statSync(filePath).mtime,
          file: filePath,
          package: pack,
          permalink: '/' + permalink,
          image: '/' + img,
          icon: '/' + icon,
          main,
          authors: [author]
        };

        var status = await checkIfModified(filePath);

        // If the file is modified or doesn't exist, try compiling it
        // Then add it to the portfolio database.
        if (status.isModified || status.doesNotExist) {
          let compiledModule = await compile(loaders, foilModule);
          await writeToDb(compiledModule);
        }
      }

    }

  }

}

/**
 * Compiles foil module by waterfalling through loaders.
 * @param loaders A matching algorithm and a compiler function.
 * @param foilModule Current foil module.
 */
async function compile(loaders: Loader[], foilModule: any) {

  // Check each loader for a match
  for (let rule of loaders) {

    // Perform deep comparison
    let compare = Object.keys(rule.test).reduce((prev, cur) => {
      let reg = new RegExp(rule.test[cur]);
      return prev || reg.test(foilModule[cur]);
    }, false);

    if (compare) {
      return await rule.loader(foilModule);
    }
  }

  return foilModule;
}