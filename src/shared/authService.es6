// from https://auth0.com/docs/quickstart/spa/react/01-login
// and  https://auth0.com/docs/quickstart/spa/react/03-session-handling

// should this be actions/reducers instead?  if it's using local storage, it's not quite the same as Redux's central state...
// but perhaps JWT should not be in local storage, so users on shared computers won't accidentally leave their credentials for others to find

import Auth0Lock from 'auth0-lock'
import { browserHistory } from 'react-router'
import { isTokenExpired } from './jwtHelper.es6'

export default class AuthService {
    constructor(clientId, domain) {
        // Configure Auth0

        const browser = (typeof window !== 'undefined')
        if (!browser) {
            return
        }
        // const redirectUrl = ((typeof window !== 'undefined') ? window.location.origin : 'localhost:3000')

        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: window.location.origin,  // redirect after successful auth
                responseType: 'token',
                sso: false
            }
        })
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.logIn = this.logIn.bind(this)
    }

    _doAuthentication(authResult) {
        console.log("==== called _doAuthentication (must be after site reloaded...)");
        // Saves the user token
        this.setTokens(authResult);
        // navigate to the home route -- #TODO:  why redirect?, can't we just change React state?
        browserHistory.replace('/')
    }

    logIn() {
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
        localStorage.setItem('idToken', authResult.idToken);
        // localStorage.setItem('access_token', authResult.accessToken);  // needed to query Auth0 for user data
        // this payload also has expiration time, which we could also track:
        // localStorage.setItem('user_id', authResult.idTokenPayload.sub);  // can this be derived from id_token?  would storing it in React state be somewhat more secure than in local storage?
    }

    getToken() {
        return localStorage.getItem('idToken')
    }

    logOut() {
        localStorage.removeItem('idToken');
    }

    getLock() {
        return this.lock
    }
}