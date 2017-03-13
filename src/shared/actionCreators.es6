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
        const url = baseApiUrl + '/users/edit';
        console.log("==== url = ", url);
        var user = {};
        request
            .post(url)
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                console.log("res = ", res);
                console.log("res.text = ", res.text);
                const payload = JSON.parse(res.text);
                user.fullName = payload.first + " " + payload.last;
                user.userType = payload.userType;
                user.email = payload.email;
                console.log("==== user.fullName = ", user.fullName);
                dispatch(setCurrentUser(user));
            });
    }
}

export function setCurrentUser(currentUser) {
    return { type: 'SET_CURRENT_USER', currentUser }
}

export function logOutUser() {
    return { type: 'LOG_OUT_USER' }
}

export function requestBid(userKey, productKey, qty) {
    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/bid_requests/create';
        console.log("==== url = ", url);
        const idToken = localStorage.getItem('idToken')
        let requestId
        // #TODO: handle api error (update Redux store accordingly)
        request
            .post(url)
            .set('Authorization', 'Bearer ' + idToken)
            .send({product_spec_id: productKey, quantity: qty})
            .end(function (err, res) {
                console.log("res = ", res);
                console.log("res.text = ", res.text);
                const payload = JSON.parse(res.text);
                requestId = payload.bid_request_id
                console.log("==== new bidRequestId = ", requestId);
                dispatch(setBidRequest(userKey, productKey, qty));
            });
    }
}

export function setBidRequest(userKey, productKey, qty) {
    return { type: 'BID_REQUEST', userKey, productKey, qty }
}

export function bid(userKey, productKey, price) {
    return { type: 'BID', userKey, productKey, price }
}