import portfolio from './portfolio';

export default (app) => {
    // SPA
  app.post('/api/v1/portfolio', portfolio);
};