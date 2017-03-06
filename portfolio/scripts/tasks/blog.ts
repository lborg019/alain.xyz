import * as path from 'path';
import * as fs from 'fs';
import * as find from 'find';
import markademic from 'markademic';
import { yellow } from 'chalk';
import { database } from '../../../backend/src/db';
import { askQuestion } from './question';
import { getCover, makePermalink } from './misc';

let root = path.join(__dirname, '..', '..', 'blog');

type IPortfolioItem = {
  title: string,
  permalink: string,
  description: string,
  tags: string[],
  data: any
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

  var mtime = fs.statSync(file).mtime;

  if (data.length < 1)
    return { doesNotExist: true, isModified: false };

  return { doesNotExist: false, isModified: (data[0].mtime.getTime() !== mtime.getTime()), data: data[0] };
}

/**
 * Asks a set of questions based on a given file.
 */
async function askQuestions(file: string) {

  let permalink = '/blog' + makePermalink(file, root);

  let title = path.basename(permalink).replace(/-/g, ' ')
    .toLowerCase()
    .replace(/^.|\s\S/g, (a) => a.toUpperCase())
    .replace(/(\sA\s)|(\sOf\s)|(\sFor\s)|(\sAnd\s)/g, (a) => a.toLowerCase());

  let questions = [
    {
      key: 'permalink',
      default: permalink
    },
    {
      key: 'title',
      default: title
    },
    {
      key: 'description',
      default: ''
    },
    {
      key: 'tags',
      default: 'blog',
      cb: (ans) => ans.toLowerCase().split(' ')
    },
    {
      key: 'publishDate',
      default: new Date().toISOString(),
      cb: ans => {
        var d = new Date(ans);
        if (d === undefined) throw new Error('Please enter a valid date!');
        return d;
      }
    }
  ];

  let answers: any = {};
  // Populate the answers object.
  for (var question of questions)
    await askQuestion(question)
    .then(answer => {
      answers[question.key] = answer;
    })
    .catch(err => {console.error(err)});

  return answers;
}

/**
 * Write a given set of answers to the database.
 */
async function writeToDb(file: string, answers: IPortfolioItem) {
  await database.then(async db => {

    var portfolioCollection = db.collection('portfolio');
    var filesCollection = db.collection('files');

    // Find a references.json file next to file
    let citationsPath = path.join(file, '..', 'references.json');
    let citations;

    if (fs.existsSync(citationsPath))
      citations = JSON.parse(fs.readFileSync(citationsPath).toString());

    // Place all answers in object.
    let entry = {
      ...answers,
      data: markademic({
        input: fs.readFileSync(file).toString(),
        //citations,
        rerouteLinks: (link) => path.join(answers.permalink, link)
      }),
      mtime: fs.statSync(file).mtime,
      lastUpdated: new Date(),
      cover: getCover(file, answers.permalink),
      main: '/blog/main.js',
      file
    };

    // Index all files in permalink namespace.

    let lastPath = path.dirname(file);

    var staticFiles = find.fileSync(lastPath)
      .filter((f) => !(f.endsWith('md') || f.endsWith('json')));

    for (var sf of staticFiles) {
      var filePermalink = path.join(entry.permalink, path.relative(lastPath, sf)).replace(/\\/g, '/');

      await filesCollection.update({ file: sf }, { file: sf, permalink: filePermalink }, { upsert: true })
        .then(r => console.log(`Updated file ${sf}.`))
        .catch(e => console.log(e));

    }

    await portfolioCollection.update({ file }, entry, { upsert: true })
      .then(r => console.log(`Added ${answers.title} to the Database`))
      .catch(e => console.log(e));
  });
}


/**
 * Clean the database of any missing files in the portfolio,
 * then Check each file if it's been modified or doesn't exist,
 * And write it to the database 'protfolio' collection 
 * while writing static files to 'files' collection
 * Finally index neseted elements in 'indexes' collection.
 */
async function buildBlog() {
  console.log('📔 ' + yellow('Alain.xyz Blog Builder\n'))
  let files = find.fileSync(/\.md$/, root);

  for (var file of files) {

    var status = await checkIfModified(file);

    if (status.isModified) {
      console.log('Updating %s:', status.data.title);
      await writeToDb(file, status.data);
    }
    if (status.doesNotExist) {
      console.log('Writing new post!')
      await writeToDb(file, await askQuestions(file));
    }

    // @TODO
    // Generate XML takes a tag and generates an XML file for that tag.
    // There can also be a global XML tag if the entry is 0.
    // generateXML('blog');
    
  }

  return;
}


export { buildBlog };