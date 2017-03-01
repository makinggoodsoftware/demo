import React from 'react';
import { Router } from 'react-router';
import routes from '../shared/routes.es6'

export default class App extends React.Component {
    // this component used in both server & browser rendering, but it could probably be eliminated and have each of those set up the <Router> componenet directly

    render () {
        return (
            <Router history={this.props.history} routes={routes}/>
        )
    }
}