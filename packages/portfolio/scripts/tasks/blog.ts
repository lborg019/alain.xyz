import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import markademic from 'markademic';
import { red, yellow } from 'chalk';
import * as RSS from 'rss';

import { database } from '../../../backend/src/db';
import { getCover, makePermalink } from './misc';
import { PortfolioItem } from '../../../backend/src/schema';

let root = path.join(__dirname, '..', '..', 'blog');

type IPortfolioItem = {
  title: string,
  permalink: string,
  description: string,
  tags: string[]
}

type IModifiedFileStatus = {
  doesNotExist: boolean,
  isModified: boolean,
  data?: IPortfolioItem
};

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
 * Read the package.json file next to the markdown file
 */
async function readPackage(file: string) {

  let packagePath = path.join(file, '..', 'package.json');

  if (fs.existsSync(packagePath)) {

    let {
      name,
      description,
      author,
      tags,
      foil: {
        title,
        datePublished,
      }
    } = require(packagePath);

    let packageData = {
      title,
      description,
      authors: [author],
      tags,
      permalink: '/'+ name,
      datePublished: new Date(datePublished)
    };

    console.log('Reading data from %s.\n', packagePath);

    return packageData;
  }
  else {
    throw new Error(red("There's no package.json coresponding to this .md file!"));
  }
}

/**
 * Write a given set of answers to the database.
 */
async function writeToDb(file: string, answers: IPortfolioItem) {
  await database.then(async db => {

    var portfolioCollection = db.collection('portfolio');
    var redirectCollection = db.collection('redirect');

    // Place all answers in object.
    let entry = {
      ...answers,
      data: markademic({
        input: fs.readFileSync(file).toString(),
        //citations,
        rerouteLinks: (link) => path.join(answers.permalink, link)
      }),
      dateModified: fs.statSync(file).mtime,
      cover: getCover(file, answers.permalink),
      main: '/blog/main.js',
      file
    };

    // Index all files in permalink namespace.

    let lastPath = path.dirname(file);

    var staticFiles = find.fileSync(lastPath)
      .filter(f => !(f.endsWith('md') || f.endsWith('json')));

    for (var sf of staticFiles) {
      var filePermalink = path.join(entry.permalink, path.relative(lastPath, sf)).replace(/\\/g, '/');

      await redirectCollection.update({ to: sf }, { from: filePermalink, to: sf }, { upsert: true })
        .then(r => console.log(`Updated file ${sf}.`))
        .catch(e => console.log(e));

    }

    await portfolioCollection.update({ file }, entry, { upsert: true })
      .then(r => console.log(`Added ${answers.title} to the Database.`))
      .catch(e => console.log(e));
  });
}

async function generateXML(tag) {
  await database.then(async db => {
    let portfolioCol = await db.collection('portfolio');
    let blogs = await portfolioCol.find({ permalink: /^\/blog/ });
  });
}

/**
 * Clean the database of any missing files in the portfolio,
 * then Check each file if it's been modified or doesn't exist,
 * And write it to the database 'protfolio' collection 
 * while writing static files to 'redirect' collection
 * Finally index neseted elements in 'indexes' collection.
 */
async function buildPackage() {
  console.log('📔 ' + yellow('Alain.xyz Package Builder\n'))
  let files = find.fileSync(/\.md$/, root);

  for (var file of files) {

    var status = await checkIfModified(file);

    if (status.isModified) {
      console.log('Updating %s:', status.data.title);
      await writeToDb(file, status.data);
    }
    if (status.doesNotExist) {
      console.log('Writing new post!')
      await writeToDb(file, await readPackage(file));
    }

  }

  return;
}


export { buildPackage };