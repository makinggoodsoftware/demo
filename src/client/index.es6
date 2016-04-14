import React from 'react';
import {render} from 'react-dom';

console.log('Hello From Index.es6!');

class App extends React.Component {
    render () {
        return <p> Hello React-Tonic, from index.es6!</p>;
    }
}

render(<App/>, document.getElementById('content'));