import * as fs from 'fs';
import * as path from 'path';
import * as find from 'find';
import { database } from '../../../../backend/src/db';

/**
 * The following are various functions to get metadata 
 * for specific attributes of the portfolio system. 
 */


/**
 * Get an asset of a particular name (Whatever Format, from a given file path)
 */
export function getAsset(file: string, permalink: string, image = 'cover') {
  let dir = path.dirname(file);
  let c = find.fileSync(new RegExp(image + '\.(png|jpg|jpeg|gif)$', 'mg'), dir);
  return (c.length > 0) ? path.join(permalink, path.relative(dir, c[0])).replace(/\\/g, '/') : '';
}

/**
 * Create a Permalink from a given path string.
 */
export function makePermalink(file: string, root: string) {
  let lastPath = (path.basename(file).match(/^index/)) ?
    path.dirname(file) :
    path.join(path.dirname(file), path.basename(file).replace(/\..+$/, ''));
  return path.join('/', path.relative(root, lastPath)).replace(/\\/g, '/');
}



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
 * Check if a given file is in the database and the current file is modified.
 */
export async function checkIfModified(file: string): Promise<IModifiedFileStatus> {

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

  const rules = [,
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
export async function writeToDb(foil) {
  await database.then(async db => {

    var portfolioCollection = db.collection('portfolio');

    var redirectCollection = db.collection('redirect');

    // Index all files in permalink namespace.

    let lastPath = path.dirname(foil.file);

    let ignoredTypes = [
      'tsx',
      'ts',
      'scss',
      'md',
      'json',
      'lock'
    ]

    var staticFiles = find.fileSync(lastPath)
      .filter(f => !(ignoredTypes.reduce((prev, cur) => prev || f.endsWith(cur) ,false) || f.match(/node_modules/)));

    // Add Static files to database
    for (var sf of staticFiles) {
      var filePermalink = path.join(foil.permalink, path.relative(lastPath, sf)).replace(/\\/g, '/');

      let query = {
        to: sf
      };

      let update = {
        from: filePermalink,
        to: sf,
        dateModified: fs.statSync(sf).mtime
      };

      let options = {
        upsert: true
      };

      await redirectCollection.update(query, update, options)
        .then(r => console.log(`Updated file ${sf}.`))
        .catch(e => console.log(e));

    }

    // Add foil module to database
    await portfolioCollection.update({ permalink: foil.permalink }, foil, { upsert: true })
      .then(r => console.log(`Added ${foil.title} to the Database.`))
      .catch(e => console.log(e));
  });
}