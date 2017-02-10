import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { logInUser, getUser, logOutUser } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logInUser, getUser, logOutUser }, dispatch)
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', password: ''};
        this.lock = props.route.auth.getLock();
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handlePasswordChange(event) {
        // console.log("==== event sent value: ", event.target.value);
        // this.setState({password: '*'.repeat(event.target.value.length)});
        this.setState({password: event.target.value});
    }

    logIn(userName) {
        // console.log("==== log in click!, props.actions = ");
        userName = userName == '' ? 'Buyer One' : userName;
        this.props.logInUser(userName);
    }

    logOut() {
        // this.props.logOutUser();
        this.props.auth.logout();  // from https://auth0.com/docs/quickstart/spa/react/03-session-handling
        browserHistory.push('/');
    }

    componentWillMount() {
        // console.log("==== header component will mount, props = ", this.props);
        // Add callback for lock `authenticated` event, it appears lock can take multiple callbacks for the same event
        this.lock.on('authenticated', this._getUser.bind(this))
    }

    _getUser () {
        const token = localStorage.getItem('id_token');
        if(token) {
            console.log("==== header _getUser token!");
            this.props.getUser(token);
        } else {
            console.log("==== header _getUser no token");
        }
    }

    componentDidMount() {
        // console.log("==== header component did mount, props = ", this.props);
        // only call this if we don't have user details from the API in the store already...
        // this._getUser();
    }

    render () {
        const currentUser = this.props.currentUser;

        const links = [];
        const loginElems = [];
        let currentUserName, logOutButton = '';
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
            currentUserName = `Welcome, ${currentUser.fullName}`;
            logOutButton = <button className='log-out-btn' onClick={this.logOut.bind(this)}>Log out</button>;
            loginElems.push (
                <div classname='username'>
                    { currentUserName }{ logOutButton }
                </div>
            );
        } else {
            loginElems.push (
                <div className='label'>
                    Username:
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                </div> );
            loginElems.push (
                <div className='label'>
                    Password:
                    <input
                        type="password"
                        password={this.state.password}
                        onChange={this.handlePasswordChange.bind(this)}
                    />
                </div> );
            loginElems.push (
                <button className='label' onClick={this.logIn.bind(this, this.state.value)}>Log In</button>
            );
        }

        // console.log("==== rendering Header, links = ", links);

        return (
            <div>
                <header id='header'>
                    <nav id='main-nav'>
                        <div className='page-links'>
                            { links }
                        </div>
                        <div className='signin'>
                            { loginElems }
                        </div>
                        <div className='nav-desktop'>
                            <Link className='logo' to='/'>
                                <img src='/images/Logomakr_9976sI.png'/>
                            </Link>
                        </div>
                    </nav>
                </header>
                { this.props.children }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)