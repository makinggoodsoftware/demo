import React from 'react'
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid } from '../shared/actionCreators.es6'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, allBidRequests: store.allBidRequests.toJS(), bidRequests: store.bidRequests }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createBid }, dispatch)
}

class Bids extends React.Component {
    // the array of inputs that take bids on various products will not be React controlled components
    // because React does not allow controlled components to be initialized with 'undefined' or null
    // and we don't want to have to initialize all controlled components with empty string
    constructor(props){
        super(props)
        this.state = {bids: {}}  // ie. bids: { bidRequestId: { pricePerUnit: 1.01 } }
    }

    // groupBidRequests() {
    //     const bidRequests = this.props.bidRequests;
    //     // console.log("==== bidRequests = ", bidRequests);
    //     const requestTotals = {};
    //     for (let productKey in bidRequests) {
    //         // console.log("==== productKey = ", productKey);
    //         let sum = 0;
    //         const productRequests = bidRequests[productKey];
    //         // console.log("==== productRequests = ", productRequests);
    //         for (let buyerKey in productRequests) {
    //             // console.log("==== qtyStr = ", productRequests[buyerKey]);
    //             const qty = parseInt(productRequests[buyerKey], 10);
    //             // console.log(`==== buyerKey = ${buyerKey}, qtyInt = ${qty}`);
    //             if(!(Number.isNaN(qty) || qty < 1)) {
    //                 sum += qty;
    //                 // console.log(`==== br sum = ${sum}, qty = ${qty}`)
    //             }
    //         }
    //         requestTotals[productKey] = sum
    //     }
    //     return requestTotals;
    // }

    // keeps state in sync with the DOM's state of the input element
    handleBidChange(bidReqKey, event) {
        // console.log("==== bid change event: ", event);
        const bids = this.state.bids
        bids[bidReqKey] = { pricePerUnit: event.target.value }
        // console.log("==== setting state with: ", bids)
        this.setState({ bids })
    }

    createBid(productSpecKey, deliveryCountryCode, bidReqKey) {
        // console.log("==== looking up bid for bidReq: ", bidReqKey)
        const bid = this.state.bids[bidReqKey]
        // console.log("==== found bid: ", bid)
        bid.bidRequestIds = [bidReqKey]
        bid.deliveryCountryCode = deliveryCountryCode
        bid.originCountryCode = 'IN'  //# fix
        bid.sourceCountryCode = 'IN'  //# fix
        // console.log("==== createBid, after building bid: ", bid)
        // console.log("==== state.bids: ", this.state.bids)

        this.props.createBid(productSpecKey, bid)
    }

    buildTable() {
        // const allBidRequests = this.groupBidRequests()
        const allBidRequests = this.props.allBidRequests
        const header = (<thead><tr key='tableHeader'>
            <th className='header'>Product</th>
            <th className='header'>Country</th>
            <th className='header'>City</th>
            <th className='header'>Qty</th>
            <th className='header'>Incoterm</th>
            <th className='header'>Deadline</th>
            <th className='header'>Bid (per Unit)</th>
            <th></th>
            <th className='header'>Total</th>
        </tr></thead>)
        let rows = []
        let bid, price
        for (let productSpecKey in allBidRequests) {
            const row = (<tr key={ productSpecKey }><td>{ productSpecKey }</td></tr>)
            // console.log("==== productRow = ", row)
            rows.push(row)
            const countries = allBidRequests[productSpecKey]
            // console.log("==== countries = ", countries)
            for (let countryCode in countries) {
                const row = (<tr key={ `${productSpecKey}-${countryCode}` }><td></td><td>{ countryCode }</td></tr>)
                // console.log("==== country row = ", row)
                rows.push(row)
                const bidReqs = countries[countryCode]
                for (let bidReqId in bidReqs ) {
                    const bidReq = bidReqs[bidReqId]
                    let totalDisp = '', button = ''
                    if (bidReq.bid) {
                        const unitPrice = bidReq.bid.pricePerUnit
                        bid = `$${unitPrice}`
                        totalDisp = `$${bidReq.qty * unitPrice}`
                    } else {
                        bid = (<input
                                        type='text'
                                        // value={this.state.bids[productSpecKey]}
                                        onChange={this.handleBidChange.bind(this, bidReqId)}
                                        />)
                        button = (<button
                                        onClick={this.createBid.bind(this, productSpecKey, countryCode, bidReqId)}
                                        >Bid</button>)

                    }
                    const row = (
                        <tr key={ bidReqId }><td></td><td></td>
                            <td>{ bidReq.deliveryCity }</td>
                            <td className='number'>{ bidReq.qty }</td>
                            <td className=''>{ bidReq.incoterm }</td>
                            <td className=''>{ bidReq.deliveryDeadline }</td>
                            <td className=''>{ bid }</td>
                            <td>{ button }</td>
                            <td className='number'>{ totalDisp }</td>
                        </tr>)
                    // console.log("==== bid request row = ", row)
                    rows.push(row)
                }
            }

        }
        return (<table className='bids'>{ header }<tbody>{ rows }</tbody></table>);
    }

    render () {
        const table = this.buildTable();
        return (
            <div id='bids'>
                <div className='title'>
                    My bids
                </div>
                { table }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bids)
