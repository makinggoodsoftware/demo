// based on https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md

import { combineReducers } from 'redux';

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
        default:
            return state
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
            console.log("==== bidRquests returning newState, ", newState);
            return newState;
        default:
            return state
    }
}

// these reducers will be called with first argument set to the value of the top-level key in store
// so, passing 'currentUsers' to combineReducers will cause the currentUsers reducer to be called with the value at the currentUser key of the store object
const reducers = combineReducers({
    visibilityFilter,
    currentUser,
    bidRequests
});

export default reducers