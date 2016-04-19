import React from 'react';
import {render} from 'react-dom';
import StoreHelpers from '../shared/StoreHelpers.es6';
import {Treebeard} from 'react-treebeard';
import { StyleRoot } from 'radium';
import styles from './styles.es6';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

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
                <p>TONICMART</p>
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

render((
    <Router history={browserHistory}>
        <Route path="/" component={Catalog} />
    </Router>
), document.getElementById('content'));