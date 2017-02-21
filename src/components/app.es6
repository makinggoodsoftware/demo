import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Header from '../components/header.es6';
import Catalog from '../components/catalog.es6';
import Home from '../components/home.es6';
import BidRequests from '../components/bidRequests.es6';
import Bids from '../components/bids.es6';
import Login from '../components/login.es6';
import AuthService from '../shared/authService.es6';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.authSvc = new AuthService('Io86q40MwZlf0XcN6kc8pR5TJ2lqP8xB', 'tonicmart.auth0.com');
        this.requireAuth = (nextState, replace, callback) => {       // validate authentication for private routes
            console.log("==== requireAuth called");
                if (!this.authSvc.loggedIn()) {
                    console.log("==== not authed, redirecting");
                    replace({pathname: '/login'})
                } else {
                    console.log("==== authed!")
                }
                callback(); // passing 3rd argument makes React Router wait to be called back before continuing with the route
            }
    }

    render () {
        return (
            <Router history={browserHistory}>
                <Route component={Header} authSvc={this.authSvc}>
                    <Route path="/">
                        <IndexRoute component={Home} />
                        <Route path="login" authSvc={this.authSvc} component={Login} />
                        <Route path="catalog" component={Catalog} onEnter={this.requireAuth} />
                        <Route path="bidRequests" component={BidRequests} />
                        <Route path="bids" component={Bids} />
                    </Route>
                </Route>
            </Router>
        )
    }
}