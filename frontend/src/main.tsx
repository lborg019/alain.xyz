import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom/es';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './css';
import App from './app';
import reducers from './store/reducers';

// State
declare var devToolsExtension;

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk)
    //,devToolsExtension()
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
export * from './components';
export * from './store/actions';