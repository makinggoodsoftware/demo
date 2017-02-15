// based on https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md

import { combineReducers } from 'redux';
import Immutable from 'immutable';
function visibilityFilter(state = 'SHOW_ALL', action) {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
}

// here state is just the currentUsers value of the store object
// how does it know what part of the store to pass in?  based on the mapStateToProps in the component?
function currentUser(state = null, action) {
    const user = {};
    switch (action.type) {
        case 'LOG_IN_USER':
            if(action.userName.toLowerCase().startsWith('buyer')) {
                user.type = 'buyer'
            }
            if(action.userName.toLowerCase().startsWith('supplier')) {
                user.type = 'supplier'
            }
            user.fullName = action.userName;
            return user;
        case 'LOG_OUT_USER':
            return {}; //TODO: this and default arg value should be the same
        case 'SET_CURRENT_USER':
            if (action.currentUser) {
                console.log("==== reducer SET_CURRENT_USER returning ", action.currentUser);
                return action.currentUser
            } else {
                return state;
            }
        case 'GET_USER_AUTH0':
            console.log("GET_USER_AUTH0 reducer running with token ", action.token);
            if (action.lock && action.token) {
                action.lock.getUserInfo(action.token, function(error, userInfo) {
                    if (error) {
                        console.log("==== getUserInfo error")
                    } else {
                        console.log("==== auth0 userInfo = ", userInfo)
                    }
                });
            }
            return state;
        default:
            return state;
    }
}

function bidRequests(state = {}, action) {
    switch (action.type) {
        case 'BID_REQUEST':
            // all of this simpler with Immutable.js ?
            const bidsThisProduct = state[action.productKey] || {};
            bidsThisProduct[action.userKey] = action.qty;
            const bidsThisProductWithKey = {};
            bidsThisProductWithKey[action.productKey] = bidsThisProduct;
            const newState = Object.assign({}, state, bidsThisProductWithKey);
            console.log("==== bidRequests returning newState, ", newState);
            return newState;
        default:
            return state
    }
}

function bids(state = Immutable.Map({}), action) {
    switch (action.type) {
        case 'BID':
            const newState = state.setIn([action.userKey, action.productKey], action.price);
            console.log("==== bid returning newState, ", newState);
            return newState;
        default:
            return state
    }
}

// these reducers will be called with first argument set to the value of the top-level key in store
// so, passing 'currentUser' to combineReducers will cause the currentUser reducer to be called with the value at the currentUser key of the store object
const reducers = combineReducers({
    visibilityFilter,
    currentUser,
    bidRequests,
    bids
});

export default reducers