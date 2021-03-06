import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import './css';
import App from './app';
import reducers from './store/reducers';

// Service Worker
OfflinePluginRuntime.install();

// Glamor CSS
// hydrate(_glam);

// Redux State
const composeEnhancers = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
  ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const store = createStore(
  reducers,
  _initialState || {},
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

// React Render
const target = document.getElementById('app');

const node = (
  <Provider store={store}>
    <BrowserRouter>
      {App}
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(node, target);

// Expose App Runtime
export * from './components';
export * from './store';
export { App };