import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Header from '../components/header/header.es6';
import Catalog from '../components/catalog.es6';
import Home from '../components/home/home.es6';
import BidRequests from '../components/bidRequests.es6';
import Bids from '../components/bids.es6';
import Grid from '../components/grid/grid.es6';
import Login from '../components/login.es6';

function requireAuth (nextState, replace, callback) {       // validate authentication for private routes
    if (!window.authSvc.loggedIn()) {
        console.log("==== not authed, redirecting");
        replace({pathname: '/login'})
    } else {
        console.log("==== authed!")
    }
    callback(); // passing 3rd argument makes React Router wait to be called back before continuing with the route
}

const routes = (
    <Route path="/" component={Header}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="catalog" component={Catalog} onEnter={requireAuth} />
        <Route path="bidRequests" component={BidRequests} />
        <Route path="bids" component={Bids} />
        <Route path="grid" component={Grid} />
    </Route>
)

export default routes;