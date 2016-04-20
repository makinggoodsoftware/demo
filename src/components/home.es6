import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logInUser } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logInUser }, dispatch)
}

class Home extends React.Component {
    logIn() {
        console.log("==== log in click!, props.actions = ");
        this.props.logInUser('TestUser');
    }

    render () {
        console.log("==== props = ", this.props);

        return (
            <div>
                <p> HOME! </p>
                <button onClick={this.logIn.bind(this)}>Log In</button>
                {this.props.children}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)