import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Home, Subapp, About, Blog } from './views';

const App = (
  <div>
    <Route component={Home}>
    <Switch>
      <Route exact path="/" render={() => <div/>}/>
      <Route exact path="/about" component={About} />
      <Route exact path="/blog" render={props => <Blog {...props} />} />
      <Route render={props => <Subapp {...props} />} />
    </Switch>
    </Route>
  </div>
);

export default App;