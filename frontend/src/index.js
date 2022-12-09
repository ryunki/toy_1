import { createRoot } from 'react-dom/client';

import {legacy_createStore as createStore} from 'redux'
import {Provider } from 'react-redux'
import store from './redux/store'

import App from './App';

import "bootstrap/dist/css/bootstrap.min.css"

const rootElement = document.getElementById('root');

const root = createRoot(rootElement); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
