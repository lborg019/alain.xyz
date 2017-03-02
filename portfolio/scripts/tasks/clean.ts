import * as fs from 'fs';
import { database } from '../../../backend/src/db';

/**
 * Run through every indexed file and portfolio item to see if it still exists. 
 */
export async function clean() {
  console.log('🌊 Alain.xyz Database Cleaner\n');
  await database.then(async db => {

    var files = db.collection('files');
    var posts = db.collection('portfolio');

    var cleanFiles = col => col.find({})
      .toArray()
      .catch(err => console.error(err))
      .then(res => {
        for (var f of res) {
          fs.exists(f.file, exists => {
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
