import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Home, Portfolio, Subapp, About, Blog, NotFound } from './views';
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
          {categories.map((c, i) => <Route key={i} exact path={`/${c}`} render={props => <Portfolio {...props} />} />)}
          <Route render={props => <Subapp {...props} />} />
        </Switch>
      </Home>)} />
  </div>
);

const categories = [
  'portfolio',
  'apps',
  'libraries',
  'research'
]

export default App;