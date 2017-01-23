import * as React from 'react';
import { HashRouter, Match, Miss, Link, Redirect } from 'react-router';
import { Home, Subapp, About, Blog, NotFound} from './views';

export default (
  <HashRouter>
    <div>
      <Match exactly pattern="/" component={Home} />
      <Match pattern="/about" component={About} />
      <Match pattern="/portfolio" Component={Blog}/>
      <Match pattern="/blog" Component={Blog}/>
      <Match pattern="404" Component={NotFound}/>
      <Miss render={(props) => <Subapp {...props}/>} />
    </div>
  </HashRouter>
)
/*
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
*/