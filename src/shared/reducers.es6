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

function currentUser(state = null, action) {  // here state is just the currentUsers value of the store object
    switch (action.type) {
        case 'LOG_IN_USER':
            return 'tempName';
        default:
            return state
    }
}

// these reducers will be called with first argument set to the value of the top-level key in store
// so, passing 'currentUsers' to combineReducers will cause the currentUsers reducer to be called with the value at the currentUser key of the store object
const reducers = combineReducers({
    visibilityFilter,
    currentUser
});

export default reducers