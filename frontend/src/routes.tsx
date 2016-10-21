import * as React from 'react';
import { browserHistory, Router, Route } from 'react-router';
import { Home, Subapp, About, Blog } from './views';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Home}>
      <Route path="about" component={About} />
      <Route path="portfolio" component={About} />
      <Route path="blog" component={Blog} />
      <Route path="*" component={Subapp} />
    </Route>
  </Router>
);
