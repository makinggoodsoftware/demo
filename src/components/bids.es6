import React from 'react'
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid } from '../shared/actionCreators.es6'
import { CountryDropdown } from 'react-country-region-selector'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, allBidRequests: store.allBidRequests, bidRequests: store.bidRequests, productSpecs: store.productSpecs }
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

    // keeps state in sync with the DOM's state of the input element
    handleInputChange(bidReqKey, event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        const bids = this.state.bids
        if (bids[bidReqKey]) {
            bids[bidReqKey][name] = value
        } else {
            bids[bidReqKey] = {[name]: value}
        }
        // console.log("==== setting state with: ", bids)
        this.setState({ bids })
    }

    handleGeoChange(bidReqKey, name, value) {
        const bids = this.state.bids
        if (bids[bidReqKey]) {
            bids[bidReqKey][name] = value
        } else {
            bids[bidReqKey] = {[name]: value}
        }
        // console.log("==== geo Change setting state with: ", bids)
        this.setState({ bids })
    }

    createBid(productSpecKey, deliveryCountryCode, bidReqKey) {
        // console.log("==== looking up bid for bidReq: ", bidReqKey)
        const bid = this.state.bids[bidReqKey]
        // console.log("==== found bid: ", bid)
        bid.bidRequestIds = [bidReqKey]
        bid.deliveryCountryCode = deliveryCountryCode
        this.props.createBid(productSpecKey, bid)
    }

    buildTable() {
        // const allBidRequests = this.groupBidRequests()
        const allBidRequests = this.props.allBidRequests
        const header = (<thead><tr key='tableHeader'>
            <th className='header'></th>
            <th className='header' colSpan='2'>Dest. City</th>
            <th className='header'>Incoterm</th>
            <th className='header'>Deadline</th>
            <th className='header'>Origin</th>
            <th className='header right'>Qty</th>
            <th className='header right'>Unit Price</th>
            <th className='header right'>Delivery Price</th>
            <th></th>
            <th className='header'>Total</th>
        </tr></thead>)
        let rows = []
        let bid, deliveryPrice
        for (let productSpecKey in allBidRequests) {
            const row = (<tr key={ productSpecKey }><td colSpan='10' className='category'>{ this.props.productSpecs[productSpecKey] }</td></tr>)
            // console.log("==== productRow = ", row)
            rows.push(row)
            const countries = allBidRequests[productSpecKey]
            // console.log("==== countries = ", countries)
            for (let deliveryCountryCode in countries) {
                const deliveryCountryName = window.geoLookup[deliveryCountryCode]['name']
                const row = (<tr key={ `${productSpecKey}-${deliveryCountryCode}` }><td width='3%'></td><td className='category' colSpan='9'>{ deliveryCountryName }</td></tr>)
                // console.log("==== country row = ", row)
                rows.push(row)
                const bidReqs = countries[deliveryCountryCode]
                for (let bidReqId in bidReqs ) {
                    const bidReq = bidReqs[bidReqId]
                    let originCountryCode = '', deliveryPriceDisp = '', totalDisp = '', button = ''
                    if (bidReq.bid) {
                        originCountryCode = bidReq.bid.originCountryCode
                        const qty = parseInt(bidReq.qty)
                        const unitPrice = parseFloat(bidReq.bid.pricePerUnit)
                        bid = `$${unitPrice}`
                        if (bidReq.bid.deliveryPrice) {
                            deliveryPrice = parseFloat(bidReq.bid.deliveryPrice)
                        } else {
                            deliveryPrice = 0
                        }
                        deliveryPriceDisp = `$${deliveryPrice}`
                        totalDisp = `$${(qty * unitPrice) + deliveryPrice}`
                    } else {
                        originCountryCode = (<CountryDropdown
                                valueType='short'
                                onChange={(val) => this.handleGeoChange(bidReqId, 'originCountryCode', val)}
                            />
                        )
                        bid = (<input
                                        type='text'
                                        name='pricePerUnit'
                                        onChange={this.handleInputChange.bind(this, bidReqId)}
                                        />)
                        deliveryPriceDisp = (<input
                                        type='text'
                                        name='deliveryPrice'
                                        onChange={this.handleInputChange.bind(this, bidReqId)}
                                        />)
                        button = (<button
                                        onClick={this.createBid.bind(this, productSpecKey, deliveryCountryCode, bidReqId)}
                                        >Bid</button>)

                    }
                    const row = (
                        <tr key={ bidReqId }><td></td><td width='3%'></td>
                            <td className=''>{ bidReq.deliveryCity }</td>
                            <td className=''>{ bidReq.incoterm }</td>
                            <td className=''>{ bidReq.deliveryDeadline }</td>
                            <td className=''>{ originCountryCode }</td>
                            <td className='number'>{ bidReq.qty }</td>
                            <td className='number'>{ bid }</td>
                            <td className='number'>{ deliveryPriceDisp }</td>
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
