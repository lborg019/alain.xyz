import { graphql } from 'graphql';

import schema from './schema';
import portfolio from './portfolio';


export default (app) => {

  app.post('/graphql', (req, res) => {

    graphql(schema, req.body)
      .then(result => res.send(result));
  });

  // Legacy
  app.post('/api/v1/portfolio', portfolio);
};