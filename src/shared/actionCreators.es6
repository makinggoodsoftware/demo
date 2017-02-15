import request from 'superagent';

export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function getUserAuth0(token, lock) {
    return { type: 'GET_USER_AUTH0', token, lock }
}

export function getUser(token, externalId) {
    return (dispatch) => {
        var user = {};
        request
            .post('http://localhost:3001/users/edit')
            .send({external_id: externalId})
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                console.log("res = ", res);
                console.log("res.text = ", res.text);
                const payload = JSON.parse(res.text);
                user.fullName = payload.first + " " + payload.last;
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
    return { type: 'BID_REQUEST', userKey, productKey, qty }
}

export function bid(userKey, productKey, price) {
    return { type: 'BID', userKey, productKey, price }
}