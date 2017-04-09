import request from 'superagent';

export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function getUserAuth0(token, lock) {
    return { type: 'GET_USER_AUTH0', token, lock }
}

export function getUser(token) {
    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/users/edit'
        console.log("==== url = ", url)
        var user = {}
        request
            .post(url)
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                console.log("res = ", res)
                console.log("res.text = ", res.text)
                const payload = JSON.parse(res.text)
                user.id = payload.id
                user.fullName = payload.first + " " + payload.last
                user.userType = payload.userType
                user.email = payload.email
                console.log("==== user.fullName = ", user.fullName)
                if (user.userType == 'buyer') {
                    dispatch(fetchBidRequests(user.userType))
                }
                dispatch(setCurrentUser(user))
            });
    }
}

export function setCurrentUser(currentUser) {
    return { type: 'SET_CURRENT_USER', currentUser }
}

export function logOutUser() {
    return { type: 'LOG_OUT_USER' }
}

export function requestBid(userKey, bid) {
    // console.log("==== requestBid fn, bid = ", bid)

    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/bid_requests/create'
        // console.log("==== url = ", url)
        const idToken = localStorage.getItem('idToken')
        let requestId
        // #TODO: handle api error (update Redux store accordingly)
        request
            .post(url)
            .set('Authorization', 'Bearer ' + idToken)
            .send(bid)
            .end(function (err, res) {
                console.log("res = ", res)
                console.log("res.text = ", res.text)
                const payload = JSON.parse(res.text)
                requestId = payload.bid_request_id
                console.log("==== new bidRequestId = ", requestId)
                dispatch(setBidRequest(userKey, bid))
            })
    }
}

export function fetchBidRequests(type) {
    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/bid_requests'
        console.log("==== url = ", url)
        const idToken = localStorage.getItem('idToken')
        // #TODO: handle api error (update Redux store accordingly)
        request
            .get(url)
            .set('Authorization', 'Bearer ' + idToken)
            .end(function (err, res) {
                console.log("fetch bidRequests res = ", res)
                console.log("fetch bidRequests res.text = ", res.text)
                const payload = JSON.parse(res.text)
                if (type == 'buyer') {
                    console.log("==== user type buyer, calling setBidRequests")
                    dispatch(setBidRequests(payload))
                } else {
                    dispatch(setAllBidRequests(payload))
                }
            });
    }
}

export function createBid(productSpecKey, bid) {
    console.log("==== createBid fn, bid = ", bid)

    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/bids/create'
        // console.log("==== url = ", url)
        const idToken = localStorage.getItem('idToken')
        let bidId
        // #TODO: handle api error (update Redux store accordingly)
        request
            .post(url)
            .set('Authorization', 'Bearer ' + idToken)
            .send(bid)
            .end(function (err, res) {
                console.log("res = ", res)
                console.log("res.text = ", res.text)
                const payload = JSON.parse(res.text)
                bidId = payload.bid_id
                bid.id = bidId
                console.log("==== new bidId = ", bidId)
                dispatch(setBid(productSpecKey, bid))
            })
    }
}

export function setBidRequest(userKey, bid) {
    return { type: 'BID_REQUEST', userKey, bid }
}

export function setBidRequests(bidRequests) {
    return { type: 'BID_REQUESTS', bidRequests }
}

export function setAllBidRequests(bidRequests) {
    return { type: 'BID_REQUESTS_ALL', bidRequests }
}

export function setBid(productSpecKey, bid) {
    return { type: 'SET_BID', productSpecKey, bid }
}