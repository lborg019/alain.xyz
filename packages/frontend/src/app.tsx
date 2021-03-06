import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Home, Subapp, About, Blog, NotFound } from './views';
import { Slideshow } from './components';

const App = (
  <div>
    <Route render={props => (
      <Home {...props}>
        <Switch>
          <Route exact path='/' component={Slideshow} />
          <Route exact path='/404' component={NotFound}/>
          <Route exact path='/about' component={About} />
          <Route exact path='/blog' component={Blog} />
          <Route render={props => <Subapp {...props} />} />
        </Switch>
      </Home>)} />
  </div>
);

export default App;