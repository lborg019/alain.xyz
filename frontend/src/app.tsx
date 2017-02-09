import * as React from 'react';
import { HashRouter, Route, Miss, Link, Redirect } from 'react-router';
import { Home, Subapp, About, Blog, NotFound} from './views';

export default (
  <HashRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/portfolio" Component={Blog}/>
      <Route path="/blog" Component={Blog}/>
      <Route path="404" Component={NotFound}/>
      <Miss render={(props) => <Subapp {...props}/>} />
    </div>
  </HashRouter>
);
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