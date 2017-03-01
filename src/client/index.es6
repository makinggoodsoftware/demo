import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from '../components/app.es6';
import reducers from '../shared/reducers.es6';
import { browserHistory } from 'react-router'
import Immutable from 'immutable'
import AuthService from '../shared/authService.es6';

console.log('Hello From Index.es6!');

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

// #TODO: make this async, and logIn button dependent on it completing:
window.authSvc = new AuthService('Io86q40MwZlf0XcN6kc8pR5TJ2lqP8xB', 'tonicmart.auth0.com')

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

preloadedState.bids = Immutable.Map({}) // temporarily make state passed from server the same as client default state
const store = createStore(reducers, preloadedState, applyMiddleware(thunk))

render((
    <Provider store={store}>
        <App history={browserHistory}/>
    </Provider>
), document.getElementById('content'));