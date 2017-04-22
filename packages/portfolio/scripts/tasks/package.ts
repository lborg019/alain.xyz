import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import markademic from 'markademic';
import { red, yellow } from 'chalk';
import * as RSS from 'rss';

import { database } from '../../../backend/src/db';
import { PortfolioItem } from '../../../backend/src/schema';
import { getCover, makePermalink } from './misc';

let root = path.join(__dirname, '..', '..', 'blog');

type IPortfolioItem = {
  title: string,
  permalink: string,
  description: string,
  tags: string[]
};

type IModifiedFileStatus = {
  doesNotExist: boolean,
  isModified: boolean,
  data?: IPortfolioItem
};

/**
 * Traverse the portfolio for package.json files,
 * And attempt to build them.
 */
async function buildPackage() {

  console.log('🌟 ' + yellow('Alain.xyz Package Builder\n'));

  // Find all package.json files
  let packages = find.fileSync(/\package.json$/, root);

  for (var pack of packages) {

    let {
      name: permalink,
      main: file,
      files = [],
      description,
      author = "Alain Galvan",
      tags = [],
      foil
    } = require(pack);

    // If this isn't a foil package, continue.
    if (foil) {

      let {
        main,
        title,
        datePublished,
      } = foil;

      // For every foil file in the package, check if it's modified
      let fileList = [file, ...files];

      for (let file of fileList) {

        let foilModule = {
          permalink,
          description,
          author,
          tags
        };

        var status = await checkIfModified(f);

        // If the file is modified or doesn't exist, try compiling it
        // Then add it to the portfolio database.
        if (status.isModified || status.doesNotExist) {
          let compiledModule = await compile(foilModule);
          await writeToDb(compiledModule);
        }
      }
    }
  }

  return;
}


export { buildPackage };