import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import routes from './routes';
import reducers from './store/reducers';

import './css';

declare var devToolsExtension;

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk)
    //, devToolsExtension()
    )
  );
const target = document.getElementById('app');

const node = (
    <Provider store={store}>
      {routes}
    </Provider>
);

ReactDOM.render(node, target);

// Expose Core Components for use in dynamically loaded modules.

export * from './components';
export * from './store/actions';