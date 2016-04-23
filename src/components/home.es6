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
        this.state = {value: ''};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    logIn(userName) {
        // console.log("==== log in click!, props.actions = ");
        userName = userName == '' ? 'Buyer One' : userName;
        this.props.logInUser(userName);
    }

    render () {
        // console.log("==== props for home = ", this.props);
        let home;
        if (this.props.currentUser && this.props.currentUser.fullName) {
            home = <div>WELCOME</div>
        } else {
            home = (
                <div className='login'>
                    <div className='label'>
                        Username:
                        <input
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div className='label'>
                        Password:
                        <input
                            type="text"
                            value=''
                        />
                    </div>
                    <button className='label' onClick={this.logIn.bind(this, this.state.value)}>Log In</button>
                    {this.props.children}
                </div> )
        }

        // console.log("==== home = ", home);
        return home
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)