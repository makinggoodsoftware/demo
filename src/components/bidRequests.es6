import React from 'react';
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bid } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, bidRequests: store.bidRequests, bids: store.bids.toJS() }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ bid }, dispatch)
}

class BidRequests extends React.Component {
    // the array of inputs that take bids on various products will not be React controlled components
    // because React does not allow controlled components to be initialized with 'undefined' or null
    // and we don't want to have to initialize all controlled components with empty string
    constructor(props){
        super(props);
        this.state = {bids: {'IOLPMMA Single piece': ''}};
    }

    groupBidRequestsByBuyer() {
        const bidRequests = this.props.bidRequests
        const currentUserKey = this.props.currentUser.id
        // console.log("==== bidRequests = ", bidRequests);
        const requests = {}
        for (let productKey in bidRequests) {
            // console.log("==== productKey = ", productKey);
            // const productRequests = bidRequests[productKey];
            // console.log("==== productRequests = ", productRequests);
            const qty = bidRequests[productKey][currentUserKey].qty
            if(qty) {
                // const bidRequest = {};
                requests[productKey] = qty
                // requests.push(bidRequest);
            }
        }
        return requests;     
    }

    applyBids(bidRequests) {
        const bids = this.props.bids;
        const requestsWithBids = {};
        for (let supplierKey in bids) {
            console.log("==== supplierKey = ", supplierKey);
            for (let productKey in bidRequests) {
                console.log("==== productKey = ", supplierKey);
                const bid = bids[supplierKey][productKey];
                console.log("==== bid = ", bid);
                if(bid) {
                    const lowBid = requestsWithBids[productKey] ? requestsWithBids[productKey].lowBid : null;
                    if(!lowBid || lowBid.price > bid) {
                        requestsWithBids[productKey] = {qty: bidRequests[productKey], lowBid: {supplierKey, price: bid} };
                    }
                }
            }
        }
        // this is a hack that should be fixed by a better data structure:
        for (let productKey in bidRequests) {
            if (!requestsWithBids[productKey]) {
                console.log("==== no ", requestsWithBids[productKey]);
                requestsWithBids[productKey] = {qty: bidRequests[productKey]};
            }
        }

        return requestsWithBids;
    }

    // keeps state in sync with the DOM's state of the input element
    handleBidChange(productKey, event) {
        console.log("==== bid change event: ", event);
        const bids = this.state.bids;
        bids[productKey] = event.target.value;
        console.log("==== setting state with: ", bids);
        this.setState(bids);
    }

    bid(productKey) {
        console.log("==== bid on product: ", productKey);
        console.log("==== bid with price: ", this.state.bids[productKey]);
        console.log("==== state.bids: ", this.state.bids);
        this.props.bid(this.props.currentUser.fullName, productKey, this.state.bids[productKey]);
    }

    buildTable(requestsWithBids) {
        const header = (<thead><tr key='tableHeader'><th></th><th className='header'>Quantity</th><th className='header'>Winning Bidder</th><th className='header'>Bid (per Unit)</th><th className='header'>Total</th></tr></thead>);
        let rows = [];
        for (let productKey in requestsWithBids) {
            let lowBidder = 'No winning bid yet';
            let price = 0;
            let lowPrice = '';
            let total = 0;
            if(requestsWithBids[productKey].lowBid) {
                lowBidder = requestsWithBids[productKey].lowBid.supplierKey;
                price = requestsWithBids[productKey].lowBid.price;
                lowPrice = `$${price}`;
                total = price * requestsWithBids[productKey].qty;
                console.log("==== computed total: ", total);
            }

            const row = (<tr key={ productKey }><td>{ productKey }</td><td className='number'>{ requestsWithBids[productKey].qty }</td><td className='number'>{ lowBidder }</td><td className='number'>{ lowPrice }</td><td className='number'>{ `$${total}` }</td></tr>);
            rows.push(row);
        }
        return (<table className='bids'>{ header }<tbody>{ rows }</tbody></table>);
    }

    render () {
        const requests = this.groupBidRequestsByBuyer();
        const requestsWithBids = this.applyBids(requests);
        const table = this.buildTable(requestsWithBids);
        console.log("==== table = ", table);
        return (
            <div id='bid-requests'>
                <div className='title'>
                    Bid Requests
                </div>
                { table }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidRequests)
