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
// or would it be possible to load this during webpack bundling, if it's not a session that expires?
window.authSvc = new AuthService('Io86q40MwZlf0XcN6kc8pR5TJ2lqP8xB', 'tonicmart.auth0.com')

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__


// format is { productSpecId: { countryCode: { bidRequestId: { bidRequest, including property 'bid' of any bid the current supplier has places for this request } } } }
const allBidRequests = {
    "1001":
        {
            "IN": {
                1: {
                    id: 1,
                    "qty": 1000,
                    "deliveryDeadline": "2017-03-01",
                    "deliveryCity": "City",
                    "deliveryBidRequested": true,
                    "incoterm": "CIP",
                    bid: {pricePerUnit: 1.01}
                },
                2: {
                    id: 2,
                    "qty": 1500,
                    "deliveryDeadline": "2017-03-02",
                    "deliveryCity": "City",
                    "deliveryBidRequested": true,
                    "incoterm": "CIP"
                }
            },
            "NP": {
                3: {
                    id: 3,
                    "qty": 1100,
                    "deliveryDeadline": "2017-03-11",
                    "deliveryCity": "Kat",
                    "deliveryBidRequested": true,
                    "incoterm": "FOB"
                },
                4: {
                    id: 4,
                    "qty": 1600,
                    "deliveryDeadline": "2017-03-12",
                    "deliveryCity": "Srin",
                    "deliveryBidRequested": true,
                    "incoterm": "CIP"
                }
            }
        }
    ,
    "1002":
        {
            "IN": {
                5: {
                    id: 5,
                    "qty": 2000,
                    "deliveryDeadline": "2017-03-02",
                    "deliveryCity": "City",
                    "deliveryBidRequested": false,
                    "incoterm": "CIP"
                },
                6: {
                    id: 6,
                    "qty": 3000,
                    "deliveryDeadline": "2017-03-03",
                    "deliveryCity": "City3",
                    "deliveryBidRequested": true,
                    "incoterm": "FOB"
                }
            }
        }

}

preloadedState.allBidRequests = Immutable.fromJS(allBidRequests) // temporarily make state passed from server the same as client default state
const store = createStore(reducers, preloadedState, applyMiddleware(thunk))

render((
    <Provider store={store}>
        <App history={browserHistory}/>
    </Provider>
), document.getElementById('content'));