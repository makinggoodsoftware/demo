import React from 'react';
import { render } from 'react-dom';
import StoreHelpers from '../shared/storeHelpers.es6';
import { Treebeard } from 'react-treebeard';
import { StyleRoot } from 'radium';
import styles from './styles.es6';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Header from '../components/header.es6';
import Home from '../components/home.es6';
import BidRequests from '../components/bidRequests.es6';
import Bids from '../components/bids.es6';
import ProductForm from '../components/productForm.es6';
import reducers from '../shared/reducers.es6';
import AuthService from '../shared/authService.es6';
import Login from '../components/login.es6';

console.log('Hello From Index.es6!');

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

class Catalog extends React.Component {
    constructor(props){
        super(props);
        this.state = { data: StoreHelpers.getProducts(), cursor: null };
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled){
        // console.log(`==== got onToggle with toggled = ${toggled} loading = ${node.loading} and node = `, node);
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ console.log("==== children found!"); node.toggled = toggled; }
        this.setState({ cursor: node });
    }

    componentWillUpdate(_, nextState) {
        console.log("==== app nextState = ", nextState)
    }

    render () {
        return (
            <div id='catalog'>
                <div className='title'>
                    Catalog
                </div>
                <StyleRoot>
                    <div style={styles.component}>
                        <Treebeard
                            style={styles}
                            className='product-tree'
                            data={this.state.data}
                            onToggle={this.onToggle}
                        />
                    </div>
                    <div style={styles.component}>
                        <ProductForm node={this.state.cursor}/>
                    </div>
                </StyleRoot>
            </div>
        )
    }
}

let store = createStore(reducers); // second arg here would be initial store, ie, rehydrated from server in a universal app

const auth = new AuthService('Io86q40MwZlf0XcN6kc8pR5TJ2lqP8xB', 'tonicmart.auth0.com');

// validate authentication for private routes
const requireAuth = (nextState, replace, callback) => {
    console.log("==== requireAuth called");
    if (!auth.loggedIn()) {
        console.log("==== not authed, redirecting")
        replace({ pathname: '/login' })
    } else {
        console.log("==== authed!")
    }
    callback()
}

render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route component={Header}>
                <Route path="/">
                    <IndexRoute component={Home} />
                    <Route path="login" auth={auth} component={Login} />
                    <Route path="catalog" component={Catalog} onEnter={requireAuth} />
                    <Route path="bidRequests" component={BidRequests} />
                    <Route path="bids" component={Bids} />
                </Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('content'));