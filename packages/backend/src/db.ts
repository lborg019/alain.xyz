import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017/db';

console.log('🍃 Opening MongoDB Connection.')

const database: Promise<Db> = MongoClient.connect(url)
  .catch(reason => console.error(reason));

function closeConnection(code) {
  database.then(async (db) => {
    console.log('🍃 Closing MongoDB Connection.');
    db.close();
    process.exit();
  });
}

process
  .on('SIGTERM', closeConnection)
  .on('SIGINT', closeConnection);

export { database };