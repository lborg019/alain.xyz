import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import markademic from 'markademic';
import { red, yellow } from 'chalk';
import * as RSS from 'rss';

import { database } from '../../../backend/src/db';
import { PortfolioItem } from '../../../backend/src/schema';
import { getAsset, makePermalink } from './misc';

let root = path.join(__dirname, '..', '..');

type IPortfolioItem = {
  title: string,
  permalink: string,
  description: string,
  keywords: string[]
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
      main: file = "index.md",
      description = '',
      author = "Alain Galvan",
      keywords = [],
      foil
    } = require(pack);

    // If this isn't a foil package, continue.
    if (foil) {

      let {
        main,
        title,
        datePublished,
        image,
        data
      } = foil;

      // For every foil file in the package, check if it's modified
      let fileList = [file].map(f => path.join(pack, '..', f));

      for (let file of fileList) {

        // check if that's not a folder
        if (!fs.statSync(file).isDirectory()) {

          let img = getAsset(file, permalink);
          let icon = getAsset(file, permalink, 'icon');

          let foilModule = {
            ...foil,
            title,
            description,
            keywords,
            datePublished: new Date(datePublished),
            dateModified: fs.statSync(file).mtime,
            file,
            permalink: '/' + permalink,
            image: '/' + img,
            icon: '/' + icon,
            main: '/' + main,
            authors: [author]
          };

          var status = await checkIfModified(file);

          // If the file is modified or doesn't exist, try compiling it
          // Then add it to the portfolio database.
          if (status.isModified || status.doesNotExist) {
            let compiledModule = await compile(foilModule);
            await writeToDb(compiledModule);
          }
        }
      }
    }
  }

  return;
}

/**
 * Check if a given file is in the database and the current file is modified.
 */
async function checkIfModified(file: string): Promise<IModifiedFileStatus> {

  var data = await new Promise<any[]>((res, rej) => {

    database.then(db => {
      var c = db.collection('portfolio');

      // Check if the default permalink is in the database.
      c.find({ file: file })
        .toArray()
        .then((d) =>
          res(d)
        )
        .catch((e) =>
          rej(e)
        );
    });
  });

  var { mtime } = fs.statSync(file);

  if (data.length < 1)
    return {
      doesNotExist: true,
      isModified: false
    };

  return {
    doesNotExist: false,
    isModified: (data[0].dateModified.getTime() !== mtime.getTime()),
    data: data[0]
  };
}

/**
 * Compiles a given foil module by passing it through
 * an appropriate loader.
 */
async function compile(foil) {

  // @TODO - Move outside of module to config object passed to package compiler.

  const rules = [{
    test: { file: /\.md?$/ },
    loader: foil => ({
      ...foil,
      data: markademic({
        input: fs.readFileSync(foil.file).toString(),
        rerouteLinks: (link) => path.join(foil.permalink, link)
      })
    })
  },
  {
    test: {
      title: /Alain\.xyz \|/
    },
    loader: foil => foil
  }];

  for (let rule of rules) {
    // @TODO - Replace with deep comparison
    let compare = Object.keys(rule.test).reduce((prev, cur) => {
      let reg = new RegExp(rule.test[cur]);
      return prev || reg.test(foil[cur]);
    }, false);
    if (compare) {
      return rule.loader(foil);
    }
  }
  return foil;
}

/**
 * Write a given set of answers to the database.
 */
async function writeToDb(foil) {
  await database.then(async db => {

    var portfolioCollection = db.collection('portfolio');

    var redirectCollection = db.collection('redirect');

    // Index all files in permalink namespace.

    let lastPath = path.dirname(foil.file);

    var staticFiles = find.fileSync(lastPath)
      .filter(f => !(f.endsWith('tsx') || f.endsWith('md') || f.endsWith('json') || f.match(/node_modules/)));

    for (var sf of staticFiles) {
      var filePermalink = path.join(foil.permalink, path.relative(lastPath, sf)).replace(/\\/g, '/');

      await redirectCollection.update({ to: sf }, { from: filePermalink, to: sf }, { upsert: true })
        .then(r => console.log(`Updated file ${sf}.`))
        .catch(e => console.log(e));

    }

    await portfolioCollection.update({ permalink: foil.permalink }, foil, { upsert: true })
      .then(r => console.log(`Added ${foil.title} to the Database.`))
      .catch(e => console.log(e));
  });
}


export { buildPackage };