import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { logOutUser } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logOutUser }, dispatch)
}

class Header extends React.Component {
    logOut() {
        this.props.logOutUser();
        browserHistory.push('/');
    }
    
    render () {
        const currentUser = this.props.currentUser;

        const links = [];
        if(currentUser && currentUser.type == 'buyer') {
            links.push(<Link to="/catalog" key="catalog">Catalog</Link>)
        }
        console.log("==== rendering Header, links = ", links);

        let currentUserName, logOutButton = '';
        if (currentUser && currentUser.fullName) {
            currentUserName = `Welcome, ${currentUser.fullName}`;
            logOutButton = <button className='log-out-btn' onClick={this.logOut.bind(this)}>Log out</button>;
        }

        return (
            <div>
                <div><span className='logo'>TONICMART</span><span className='links'>{ links }</span><span className='username'>{ currentUserName }{ logOutButton }</span></div>
                { this.props.children }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)