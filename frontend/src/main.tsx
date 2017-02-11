import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom/es';
import { createStore, applyMiddleware, compose } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import App from './app';
import reducers from './store/reducers';
 
// Debug
const NODE_ENV = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

// State
declare var devToolsExtension;

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk)
    , (NODE_ENV !== 'production') ? devToolsExtension() : undefined
    )
  );


// Render
const target = document.getElementById('app');

const node = (
    <Provider store={store}>
      <BrowserRouter>
        {App}
      </BrowserRouter>
    </Provider>
);

ReactDOM.render(node, target);

// Expose
export { NODE_ENV };
export * from './components';
export * from './store/actions';