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
    constructor() {
        super();
        this.state = {value: 'Hello!'};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    logIn(userName) {
        console.log("==== log in click!, props.actions = ");
        this.props.logInUser(userName);
    }

    render () {
        console.log("==== props = ", this.props);

        return (
            <div>
                <p> HOME! </p>
                Username:
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                />
                Password:
                <input
                    type="text"
                    value=''
                />

                <button onClick={this.logIn.bind(this, this.state.value)}>Log In</button>
                {this.props.children}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)