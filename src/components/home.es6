import React from 'react';
import { Link } from 'react-router';
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
        this.state = {value: '', password: ''};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handlePasswordChange(event) {
        console.log("==== event sent value: ", event.target.value);
        // this.setState({password: '*'.repeat(event.target.value.length)});
        this.setState({password: event.target.value});
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
            let links = [];
            switch (this.props.currentUser.type) {
                case 'buyer':
                    links.push( <div key='catalog'><Link
                                    to = "/catalog" >
                                    Click here to browse our catalog and request product bids
                                </Link></div>
                    );
                    links.push( <div key='bidRequests'><Link
                                    to = "/bidRequests" >
                                    Click here to see your bid requests
                                </Link></div>
                    );
                    break;
                case 'supplier':
                    links.push( <div key='bids'><Link
                                    to = "/bids">
                        Click here to see buyer requests and enter bids</Link></div>
                    )
            }
            home = <div className='intro'>{ links }</div>;
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
                            type="password"
                            password={this.state.password}
                            onChange={this.handlePasswordChange.bind(this)}
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