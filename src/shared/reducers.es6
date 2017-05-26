// based on https://github.com/reactjs/redux/blob/master/docs/basics/Reducers.md

import { combineReducers } from 'redux'

// here state is just the currentUsers value of the store object, determined by mapStateToProps in the component

function xhrs(state = {}, action) {
    switch (action.type) {
        case 'UPDATE_XHR_STATUS':
            console.log(`==== reducer uXhrStatus got action`, action)
            state[action.xhrId] = action
            return Object.assign({}, state)
        default:
            return state
    }
}

function currentUser(state = null, action) {
    const user = {}
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
            console.log("==== reducer SET_CURRENT_USER returning ", action.currentUser)
            return action.currentUser
        case 'GET_USER_AUTH0':
            console.log("GET_USER_AUTH0 reducer running with token ", action.token)
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

function tenders(state = {}, action) {
    switch (action.type) {
        case 'SET_TENDER':  // when user submits a new one
            const tender = action.tender
            console.log("==== setting tender: ", tender)
            state[tender.id] = tender
            let newState = Object.assign({}, state)
            console.log("==== set tender returning newState, ", newState)
            return newState
        case 'SET_TENDERS':  // when they're fetched from server
            return Object.assign({}, state, action.tenders)
        case 'SET_BID': // suppliers
            console.log(`==== SET_BID reducer, action.productSpecKey = ${action.productSpecKey}, action.bid = `, action.bid)
            // #TODO: handle multiple bidRequestIds:
            // set the whole array of bids because only suppliers can bid, and they only ever get to see their own bids
            state[action.bid.bidRequestIds[0].toString()]['bids'] = [action.bid]
            newState = Object.assign({}, state)
            console.log("==== SET_BID new state = ", newState)
            return newState
        default:
            return state
    }
}

function tenderTree(state = {}, action) {
    switch (action.type) {
        case 'SET_TENDER_TREE':
            return Object.assign({}, state, action.tenderTree)
        case 'SET_IN_TENDER_TREE':  // when user submits a new one
            // all of this simpler with Immutable.js ?
            const tender = action.tender
            // the var tendersByCountry means tenders keyed by deliveryCountryCode, then tender.id
            // other vars holding sub-objects have analogous names
            // console.log("==== setting tender: ", tender)
            let tendersByCountry = state[tender.commodityId] || {}
            const tenderIds = tendersByCountry[tender.deliveryCountryCode] || []
            tenderIds.push(tender.id)
            // console.log("==== tenderIds now = ", tenderIds)
            tendersByCountry[tender.deliveryCountryCode] = tenderIds
            // console.log("==== tenders by country now = ", tendersByCountry)
            let newState = Object.assign({}, state, { [tender.commodityId]: tendersByCountry })
            // console.log("==== set in tender tree returning newState, ", newState)
            return newState
        default:
            return state
    }
}

function commodities(state = {}, action) {
    switch (action.type) {
        case 'SET_COMMODITIES':
            console.log("==== reducer, action.data = ", action.data)
            // top-level commodities is an array, but Object.assign turns arrays into objects with keys of 0, 1, etc.
            // we add a holding object here
            return Object.assign({}, state, action.data )
        default:
            return state
    }
}

function rawCatalog(state = {}, action) {
    return state
}

function productSpecs(state = {}, action) {
    return state
}

// these reducers will be called with first argument set to the value of the top-level key in store
// so, passing 'currentUser' to combineReducers will cause the currentUser reducer to be called with the value at the currentUser key of the store object
const reducers = combineReducers({
    xhrs,
    currentUser,
    tenders,
    tenderTree,
    rawCatalog,
    productSpecs,
    commodities
})

export default reducers