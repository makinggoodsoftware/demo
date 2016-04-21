import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

class Header extends React.Component {
    render () {
        const currentUser = this.props.currentUser;
        const currentUserName = currentUser ? `Welcome, ${currentUser.fullName}` : '';

        const links = [];
        if(currentUser && currentUser.type == 'buyer') {
            links.push(<Link to="/catalog" key="catalog">Catalog</Link>)
        }
        console.log("==== rendering Header, links = ", links);

        return (
            <div>
                <div><div className='logo'>TONICMART</div><div className='username'>{ currentUserName }</div></div>
                <div>
                    { links }
                </div>
                { this.props.children }
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header)