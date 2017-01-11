import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { logInUser, logOutUser } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logInUser, logOutUser }, dispatch)
}

class Header extends React.Component {
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

    logOut() {
        this.props.logOutUser();
        browserHistory.push('/');
    }
    
    render () {
        const currentUser = this.props.currentUser;

        const links = [];
        if(currentUser && currentUser.fullName) {
            switch (currentUser.type) {
                case 'buyer':
                    links.push( < Link
                    to = "/catalog"
                    key = "catalog"
                    activeClassName='headerLinkActive'>Catalog</Link >
                    );
                    links.push( < Link
                    to = "/bidRequests"
                    key = "bidRequests"
                    activeClassName='headerLinkActive'>Bid Requests</Link>
                    );
                    break;
                case 'supplier':
                    links.push( < Link
                    to = "/bids"
                    key = "bids"
                    activeClassName='headerLinkActive'>Bids</Link >
                )
            }
        } else {
            links.push ( <span className='label'>
                            Username:
                            <input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange.bind(this)}
                            />
                        </span> );
            links.push (
                        <span className='label'>
                            Password:
                            <input
                                type="password"
                                password={this.state.password}
                                onChange={this.handlePasswordChange.bind(this)}
                            />
                        </span> );
            links.push (
                        <button className='label' onClick={this.logIn.bind(this, this.state.value)}>Log In</button>
                        );
        }

        console.log("==== rendering Header, links = ", links);

        let currentUserName, logOutButton = '';
        if (currentUser && currentUser.fullName) {
            currentUserName = `Welcome, ${currentUser.fullName}`;
            logOutButton = <button className='log-out-btn' onClick={this.logOut.bind(this)}>Log out</button>;
        }

        return (
            <div>
                <div className='header'><span><Link className='logo' to='/'><img src='/images/Logomakr_9976sI.png'/></Link></span><span className='links'>{ links }</span><span className='username'>{ currentUserName }{ logOutButton }</span></div>
                { this.props.children }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)