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

class Bids extends React.Component {
    // the array of inputs that take bids on various products will not be React controlled components
    // because React does not allow controlled components to be initialized with 'undefined' or null
    // and we don't want to have to initialize all controlled components with empty string
    constructor(props){
        super(props);
        this.state = {bids: {'IOLPMMA Single piece': ''}};
    }

    groupBidRequests() {
        const bidRequests = this.props.bidRequests;
        // console.log("==== bidRequests = ", bidRequests);
        const requestTotals = {};
        for (let productKey in bidRequests) {
            // console.log("==== productKey = ", productKey);
            let sum = 0;
            const productRequests = bidRequests[productKey];
            // console.log("==== productRequests = ", productRequests);
            for (let buyerKey in productRequests) {
                // console.log("==== qtyStr = ", productRequests[buyerKey]);
                const qty = parseInt(productRequests[buyerKey], 10);
                // console.log(`==== buyerKey = ${buyerKey}, qtyInt = ${qty}`);
                if(!(Number.isNaN(qty) || qty < 1)) {
                    sum += qty;
                    // console.log(`==== br sum = ${sum}, qty = ${qty}`)
                }
            }
            requestTotals[productKey] = sum
        }
        return requestTotals;     
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

    buildTable() {
        const requestTotals = this.groupBidRequests();
        const header = (<thead><tr key='tableHeader'><th></th><th className='header'>Quantity</th><th className='header'>Bid (per Unit)</th><th></th><th className='header'>Total</th></tr></thead>);
        let rows = [];
        let bid, price;
        for (let productKey in requestTotals) {
            let total = '', button = '';
            if(this.props.bids && this.props.bids[this.props.currentUser.fullName] && (price = this.props.bids[this.props.currentUser.fullName][productKey])) {
                console.log("==== buildTable, price = ", price);
                bid = `$${price}`;
                total = `$${requestTotals[productKey] * price}`;
            } else {
                bid = (<input
                                type='text'
                                // value={this.state.bids[productKey]}
                                onChange={this.handleBidChange.bind(this, productKey)}
                                />)
                button = (<button
                                onClick={this.bid.bind(this, productKey)}
                                >Bid</button>)
            }

            const row = (<tr key={ productKey }><td>{ productKey }</td><td className='number'>{ requestTotals[productKey] }</td><td className='number'>{ bid }</td><td>{ button }</td><td className='number'>{ total }</td></tr>);
            rows.push(row);
        }
        return (<table className='bids'>{ header }<tbody>{ rows }</tbody></table>);
    }

    render () {
        const table = this.buildTable();
        // console.log("==== table = ", table);
        const requestTotals = this.groupBidRequests();
        return (
            <div>
                <div>bidRequests: {JSON.stringify(requestTotals)}</div>
                <div>bids: {JSON.stringify(this.props.bids)}</div>
                { table }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bids)
