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
import { CountryRegionData } from 'react-country-region-selector'

console.log('Hello From Index.es6!');

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

// #TODO: make this async, and logIn button dependent on it completing:
// or would it be possible to load this during webpack bundling, if it's not a session that expires?
window.authSvc = new AuthService('Io86q40MwZlf0XcN6kc8pR5TJ2lqP8xB', 'tonicmart.auth0.com')

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

window.geoSourceData = CountryRegionData
// console.log("==== sourceData = ", window.geoSourceData)
const geoLookup = Object.assign(...window.geoSourceData.map(country => {
    const regions = Object.assign(...country[2].split('|').map(region => {
        const regionArr = region.split('~')
        return { [regionArr[1]]: regionArr[0] }
    }))
    return {[country[1]]: { name: country[0], regions } }
} ))
window.geoLookup = geoLookup
console.log("==== geoLookup = ", window.geoLookup)

// for more about this syntax - function body in parens - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
// const productSpecs = Object.assign(...preloadedState.rawCatalog.map(productSpec => ({[productSpec[4]]: productSpec[2]})))
// preloadedState.productSpecs = productSpecs

const store = createStore(reducers, preloadedState, applyMiddleware(thunk))

render((
    <Provider store={store}>
        <App history={browserHistory}/>
    </Provider>
), document.getElementById('content'));