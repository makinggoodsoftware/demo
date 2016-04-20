import React from 'react';
import {render} from 'react-dom';
import StoreHelpers from '../shared/storeHelpers.es6';
import {Treebeard} from 'react-treebeard';
import { StyleRoot } from 'radium';
import styles from './styles.es6';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Home from '../components/home.es6';
import reducers from '../shared/reducers.es6';

console.log('Hello From Index.es6!');

const HELP_MSG = 'Select a Product on the Left...';

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

class NodeViewer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const style = styles.viewer;
        // let json = JSON.stringify(this.props.node, null, 4);
        console.log("==== this.props.node = ", this.props.node);
        // console.log("==== json = ", json);
        // if(!json){ console.log("==== !json"); json = HELP_MSG; }
        // console.log("==== json = ", json);
        console.log("==== this.props.node == null ", this.props.node == null);
        const name = this.props.node && this.props.node.price ? this.props.node.name : HELP_MSG;
        console.log("==== name = ", name);
        return (
            <div style={style.base}>
                {name}
            </div>
        );
    }
}

NodeViewer.propTypes = {
    node: React.PropTypes.object
};

class Header extends React.Component {
    render () {
        return (
                <div>
                    <p> TONICMART </p>
                    <div><Link to="/catalog">Catalog</Link></div>
                    {this.props.children}
                </div>
        )
    }
}

class Catalog extends React.Component {
    constructor(props){
        super(props);
        this.state = { data: StoreHelpers.getProducts(), cursor: null };
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled){
        console.log(`==== got onToggle with toggled = ${toggled} loading = ${node.loading} and node = `, node);
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
            <StyleRoot>
                <div>PRODUCTS</div>
                <div style={styles.component}>
                    <Treebeard
                        className='product-tree'
                        data={this.state.data}
                        onToggle={this.onToggle}
                    />
                </div>
                <div style={styles.component}>
                    <NodeViewer node={this.state.cursor}/>
                </div>
            </StyleRoot>
        )
    }
}

let store = createStore(reducers); // second arg here would be initial store, ie, rehydrated from server in a univeral app

render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route component={Header}>
                <Route path="/">
                    <IndexRoute component={Home} />
                    <Route path="catalog" component={Catalog} />
                </Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('content'));