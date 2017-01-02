import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';

import api from './api';
import { database } from './db';
import { renderPage } from './render';

const app = express();

// Configure Exprses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) =>
    res.status(500).send(JSON.stringify({ err: 'Bad request!' }))
);
app.use(compression({ level: 9 }));

// Route Frontend assets
const root = path.join(__dirname, '..', '..', 'frontend');
app.use('/assets', express.static(path.join(root, 'assets')));

api(app);

// Route Static Portfolio Files
database.then((db) => {

  let collection = db.collection('files');

  // File Routing
  // Sends files indexed by database.
  app.get('*.*', (req, res) => {

    let query = {
      permalink: req.originalUrl
    };

    collection.find(query)
      .limit(1)
      .toArray((errCol, data) => {
        if (errCol || data.length < 1)
          return res.sendStatus(404);
        else
          res.sendFile(data[0].file);
      });

  });

  // All other routes are handled on the frontend.
  app.get('*', renderPage);
});

// Server Start
app.listen(3000, () => {
  console.log('Alain.xyz Running @ port 3000');
});

// Expose Module
export {app, database};