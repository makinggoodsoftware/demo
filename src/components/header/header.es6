import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { logInUser, getUserAuth0, setCurrentUser, getUser, fetchBidRequests, logOutUser } from '../../shared/actionCreators.es6'
import imgLogo from './assets/Logomakr_9976sI.png'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logInUser, getUserAuth0, setCurrentUser, getUser, fetchBidRequests, logOutUser }, dispatch)
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.authSvc = typeof window !== 'undefined' ? window.authSvc : {}
    }

    logIn() {
        this.authSvc.logIn()
    }

    logOut() {
        this.props.setCurrentUser(null);
        this.authSvc.logOut();  // from https://auth0.com/docs/quickstart/spa/react/03-session-handling
        browserHistory.push('/');
    }

    componentDidMount() {
        // Add callback for lock `authenticated` event, it appears lock can take multiple callbacks for the same event
        //#TODO: can this wait on the call made at app load to be sure authSvc has been set on window -- perhaps have a separate component including login button that only displays when call has completed
        this.authSvc.getLock().on('authenticated', this._getData.bind(this))
    }

    _getData () {
        const idToken = localStorage.getItem('idToken');
        // const access_token = localStorage.getItem('access_token');
        // const externalId = localStorage.getItem('user_id');  // id of user in Auth0 db
        if(idToken) {
            // console.log("==== header _getData token!, lock =", this.lock);
            // this.props.getUserAuth0(access_token, this.lock);  // was a good test that we can query Auth0 for user info
            this.props.getUser(idToken);
            this.props.fetchBidRequests(idToken);
        } else {
            console.log("==== header _getData no idToken");
        }
    }

    render () {
        const currentUser = this.props.currentUser;

        const links = [];
        const loginElems = [];
        let currentUserName, logOutButton = '';
        if(currentUser && currentUser.fullName) {
            switch (currentUser.userType) {
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
            logOutButton = <button className='log-out-btn' onClick={this.logOut.bind(this)}>Sign out</button>;
            loginElems.push (
                <div className='username' key='currentUserName'>
                    { currentUserName }{ logOutButton }
                </div>
            );
        } else {
            loginElems.push (
                <button className='label' key='loginBtn' onClick={this.logIn.bind(this)}>Sign In</button>
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
                                <img src={ imgLogo }/>
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