import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Home, Subapp, About, Blog } from './views';

const App = (
  <div>
    <Route render={props => (
      <Home {...props}>
        <Switch>
          <Route exact path="/" render={() => null} />
          <Route exact path="/about" component={About} />
          <Route exact path="/blog" render={props => <Blog {...props} />} />
          <Route render={props => <Subapp {...props} />} />
        </Switch>
      </Home>)} />
  </div>
);

export default App;