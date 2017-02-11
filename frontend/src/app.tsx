import * as React from 'react';
import { Route, Miss, Link, Redirect } from 'react-router/es';
import { Home, Subapp, About, Blog } from './views';

import './css';

const App = (
  <div>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/portfolio" Component={Blog} />
    <Route exact path="/blog" Component={Blog} />
    <Route path="*" Component ={Subapp} />
  </div>
);

export default App;