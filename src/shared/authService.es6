// from https://auth0.com/docs/quickstart/spa/react/01-login
// and  https://auth0.com/docs/quickstart/spa/react/03-session-handling

// should this be actions/reducers instead?  if it's using local storage, it's not quite the same as Redux's central state...
// but perhaps JWT should not be in local storage, so users on shared computers won't accidentally leave their credentials for others to find

import Auth0Lock from 'auth0-lock'
import { browserHistory } from 'react-router'
import { isTokenExpired } from './jwtHelper.es6'
// import { getUser } from '../shared/actionCreators.es6'

export default class AuthService {
    constructor(clientId, domain) {
        // Configure Auth0
        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: location.origin,  // redirect after successful auth
                responseType: 'token',
                sso: false
            }
        })
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.login = this.login.bind(this)
    }

    _doAuthentication(authResult) {
        console.log("==== called _doAuthentication (must be after site reloaded...)");
        // Saves the user token
        this.setTokens(authResult)
        // this was resulting in 401 errors: from https://tonicmart.auth0.com/userinfo:
        // this.lock.getUserInfo(authResult.idToken, function(error,profile) {
        //     if (error) {
        //         return;
        //     }
        //     // Saves the user token
        //     this.setToken(authResult.idToken);
        //     console.log("==== profile nickname = ", profile.nickname)
        // })

        // console.log("==== AuthService about to call getUser");
        // getUser(authResult.idToken);
        // navigate to the home route
        browserHistory.replace('/')
    }

    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        // return !!this.getToken()
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    setTokens(authResult) {
        // Saves user token to local storage
        console.log("==== setting tokens from authResult: ", authResult);
        console.log("==== idTokenPayload from authResult: ", authResult.idTokenPayload);
        localStorage.setItem('id_token', authResult.idToken);
        // localStorage.setItem('access_token', authResult.accessToken);  // needed to query Auth0 for user data
        // this payload also has expiration time, which we could also track:
        localStorage.setItem('user_id', authResult.idTokenPayload.sub);  // can this be derived from id_token?  would storing it in React state be somewhat more secure than in local storage?
    }

    getToken() {
        // Retrieves the user token from local storage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token');
    }

    getLock() {
        return this.lock
    }
}