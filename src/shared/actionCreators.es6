export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function logOutUser() {
    return { type: 'LOG_OUT_USER' }
}

export function requestBid(userKey, productKey, qty) {
    return { type: 'BID_REQUEST', userKey, productKey, qty }
}