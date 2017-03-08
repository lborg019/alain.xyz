import * as fs from 'fs';
import { database } from '../../../backend/src/db';
import { Collection } from 'mongodb';
/**
 * Run through every indexed file and portfolio item to see if it still exists. 
 */
export async function clean() {
  console.log('🌊 Alain.xyz Database Cleaner\n');
  await database.then(async db => {

    var files = db.collection('redirect');
    var posts = db.collection('portfolio');

    var cleanFiles = (col: Collection) =>
      col.find({})
        .toArray()
        .catch(err => console.error(err))
        .then(res => {
          if (res)
            for (var f of res) {

              let file = f.file || f.to;

              if (/\.([A-z])*$/.test(file))
                fs.exists(file, exists => {
                  if (!exists)
                    files.remove(f);
                });
            }
        });

    await cleanFiles(files);
    console.log('✨ Cleaned files collection.')
    await cleanFiles(posts);
    console.log('✨ Cleaned portfolio collection.')

  });
}
