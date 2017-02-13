export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function getUserAuth0(token, lock) {
    return { type: 'GET_USER_AUTH0', token, lock }
}

export function getUser(token, externalId) {
    return { type: 'GET_USER', token, externalId }
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