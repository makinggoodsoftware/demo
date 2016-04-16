import React from 'react';
import {render} from 'react-dom';
import StoreHelpers from '../shared/StoreHelpers.es6';
import {Treebeard} from 'react-treebeard';

console.log('Hello From Index.es6!');

// http://stackoverflow.com/questions/29223071/how-do-i-require-from-the-console-using-webpack
window['i'] = require('immutable'); // for use in console

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = { data: StoreHelpers.getProducts() };
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
            <div>
                <p>TONICMART</p>
                <div>PRODUCTS</div>
                <Treebeard
                    data={this.state.data}
                    onToggle={this.onToggle}
                />
            </div>
        )
    }
}

render(<App/>, document.getElementById('content'));