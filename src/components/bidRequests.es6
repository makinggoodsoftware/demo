import React from 'react'
import { connect } from 'react-redux'
import BidRequestsTable from './bidRequestsTable/bidRequestsTable.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

class BidRequests extends React.Component {

    render () {
        return (
            <div id='bid-requests'>
                <div className='title'>
                </div>
                <BidRequestsTable readOnly={true} ></BidRequestsTable>
            </div>
        )
    }
}

export default connect(mapStateToProps)(BidRequests)