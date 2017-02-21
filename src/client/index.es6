import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from '../components/app.es6';
import reducers from '../shared/reducers.es6';

console.log('Hello From Index.es6!');

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

let store = createStore(reducers, applyMiddleware(thunk)); // second arg here would be initial store, ie, rehydrated from server in a universal app

render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('content'));