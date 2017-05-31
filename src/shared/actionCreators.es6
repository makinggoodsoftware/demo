import request from 'superagent';
const msgDuration = 5000

export function logInUser(userName) {
    return { type: 'LOG_IN_USER', userName }
}

export function getUserAuth0(token, lock) {
    return { type: 'GET_USER_AUTH0', token, lock }
}

export function getUser(token) {
    return (dispatch) => {
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        dispatch(fetchCommodities(token, baseApiUrl))
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
                user.orgType = payload.orgType
                user.orgName = payload.orgName
                user.email = payload.email
                console.log("==== user.fullName = ", user.fullName)
                dispatch(fetchTenders(user.orgType))
                dispatch(setCurrentUser(user))
            });
    }
}

export function fetchCommodities(token, baseApiUrl) {
    return (dispatch) => {
        const url = baseApiUrl + '/bearded_tree'
        request
            .get(url)
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                console.log("fetch commodities res = ", res)
                console.log("fetch commodities res.text = ", res.text)
                const payload = JSON.parse(res.text)
                console.log("==== action, parsed commodities = ", payload)
                dispatch(setCommodities(payload))
            })
    }
}

export function setCommodities(data) {
    return { type: 'SET_COMMODITIES', data }
}

export function setCurrentUser(currentUser) {
    return { type: 'SET_CURRENT_USER', currentUser }
}

export function logOutUser() {
    return { type: 'LOG_OUT_USER' }
}

export function submitTender(userKey, tender) {
    // console.log("==== submitTender fn, tender = ", tender)

    return (dispatch) => {
        dispatch(updateXhrStatus(tender.xhrId, 'Saving...'))
        const baseApiUrl = location.hostname == 'www.tonicmart.com' ? 'https://tonicapi.herokuapp.com' : 'http://localhost:3001'
        const url = baseApiUrl + '/bid_requests/create'
        // console.log("==== url = ", url)
        const idToken = localStorage.getItem('idToken')
        request
            .post(url)
            .set('Authorization', 'Bearer ' + idToken)
            .send(tender)
            .end(function (err, res) {
                console.log("res = ", res)
                console.log("res.text = ", res.text)
                const payload = JSON.parse(res.text)
                let statusText = null, errors = null
                if (res.statusCode == 201) {
                    tender.id = payload.bid_request_id
                    dispatch(setTender(tender))
                    dispatch(setInTenderTree(tender))
                    statusText = 'Saved.'
                    setTimeout(() => {
                        dispatch(updateXhrStatus(tender.xhrId), '')
                    }, msgDuration)
                } else {
                    statusText = 'Error'
                    errors = payload.error
                }
                dispatch(updateXhrStatus(tender.xhrId, statusText, errors))
            })
    }
}

function updateXhrStatus(xhrId, statusText, errors) {
    console.log(`==== action uXhrStatus got id ${xhrId} with status ${statusText}, errors ${errors}`)
    return ({type: 'UPDATE_XHR_STATUS', xhrId, statusText, errors })
}

export function fetchTenders() {
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
                dispatch(setTenders(payload.tenders))
                dispatch(setTenderTree(payload.tenderTree))
            })
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

export function setTender(tender) {
    return { type: 'SET_TENDER', tender }
}

export function setTenderTree(tenderTree) {
    return { type: 'SET_TENDER_TREE', tenderTree }
}

export function setInTenderTree(tender) {
    return { type: 'SET_IN_TENDER_TREE', tender }
}

export function setTenders(tenders) {
    return { type: 'SET_TENDERS', tenders }
}

export function setBid(productSpecKey, bid) {
    return { type: 'SET_BID', productSpecKey, bid }
}

export function getAgGridModule() {
    console.log("==== action getAgGridModule called")
    return (dispatch) => {
        // webpackChunkName is optional:
        import(/* webpackChunkName: "ag-grid-react" */ 'ag-grid-react').then(TopModule => {
            console.log("==== import of ag-grid-react has returned TopModule: ", TopModule)
            dispatch(setAgGridModule(TopModule.AgGridReact))
        }).catch(err => console.log('In actionCreators, Failed to load ag-grid-react', err))
    }
}

function setAgGridModule(module) {
    return { type: 'SET_AG_GRID_MODULE', module }
}