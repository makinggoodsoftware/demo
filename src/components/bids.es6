import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid } from '../shared/actionCreators.es6'
import BidRequestsTable from './bidRequestsTable/bidRequestsTable.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createBid }, dispatch)
}

class Bids extends React.Component {
    constructor(props){
        super(props)
    }

    render () {
        return (
            <div id='bids'>
                <div className='title'>
                    My bids
                </div>
                <BidRequestsTable></BidRequestsTable>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bids)
