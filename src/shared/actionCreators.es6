export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function getUser(token) {
    return { type: 'GET_USER', token }
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