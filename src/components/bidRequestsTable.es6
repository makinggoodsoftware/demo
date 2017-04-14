import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid } from '../shared/actionCreators.es6'
import { CountryDropdown } from 'react-country-region-selector'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, bidRequests: store.bidRequests, productSpecs: store.productSpecs }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createBid }, dispatch)
}

class BidRequestsTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {bids: {}}  // ie. bids: { bidRequestId: { pricePerUnit: 1.01 } }
    }

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
        const bidRequests = this.props.bidRequests
        const header = (<thead>
        <tr key='tableHeader'>
            <th className='header'></th>
            <th className='header' colSpan='2'>Dest. City</th>
            <th className='header'>Incoterm</th>
            <th className='header'>Deadline</th>
            <th className='header right'>Qty</th>
            <th className='header right'>Unit Price</th>
            <th className='header right'>Delivery Price</th>
            <th className='header'>Total</th>
            <th className='header'>Origin</th>
            <th></th>
        </tr>
        </thead>)
        let rows = []
        for (let productSpecKey in bidRequests) {
            const row = (<tr key={ productSpecKey }>
                <td colSpan='10' className='category'>{ this.props.productSpecs[productSpecKey] }</td>
            </tr>)
            // console.log("==== productRow = ", row)
            rows.push(row)
            const countries = bidRequests[productSpecKey]
            // console.log("==== countries = ", countries)
            for (let deliveryCountryCode in countries) {
                const deliveryCountryName = window.geoLookup[deliveryCountryCode]['name']
                const row = (<tr key={ `${productSpecKey}-${deliveryCountryCode}` }>
                    <td width='3%'></td>
                    <td className='category' colSpan='9'>{ deliveryCountryName }</td>
                </tr>)
                // console.log("==== country row = ", row)
                rows.push(row)
                const bidReqs = countries[deliveryCountryCode]
                for (let bidReqId in bidReqs) {
                    // console.log("==== bidReq id = ", bidReqId)
                    const bidReq = bidReqs[bidReqId]
                    // console.log("==== bidReq = ", bidReq)
                    let bidColumnValues = [], deliveryPriceDisp = '', totalDisp = '', button = ''
                    // console.log("==== is array: ", Array.isArray(bidReq.bids ))
                    if (Array.isArray(bidReq.bids) && bidReq.bids.length > 0) {
                        // console.log("==== found bids for the request, length = ", bidReq.bids.length)
                        bidColumnValues = bidReq.bids.map((bid) => {
                            let deliveryPrice
                            const qty = parseInt(bidReq.qty)
                            const unitPrice = parseFloat(bid.pricePerUnit)
                            const unitPriceStr = `$${unitPrice}`
                            if (bid.deliveryPrice) {
                                deliveryPrice = parseFloat(bid.deliveryPrice)
                            } else {
                                deliveryPrice = 0
                            }
                            deliveryPriceDisp = `$${deliveryPrice}`
                            totalDisp = `$${(qty * unitPrice) + deliveryPrice}`
                            const originCountryName = window.geoLookup[bid.originCountryCode]['name']
                            return [ unitPriceStr, deliveryPriceDisp, totalDisp, originCountryName, button ]
                        })
                    } else if (!this.props.readOnly) {
                        // console.log("==== found no bids, building input elems")
                        bidColumnValues = [[
                        <input
                            type='text'
                            name='pricePerUnit'
                            onChange={this.handleInputChange.bind(this, bidReqId)}
                        />,
                        <input
                            type='text'
                            name='deliveryPrice'
                            onChange={this.handleInputChange.bind(this, bidReqId)}
                        />,
                        '',
                        <CountryDropdown
                                valueType='short'
                                onChange={(val) => this.handleGeoChange(bidReqId, 'originCountryCode', val)}
                        />,
                        <button
                            onClick={this.createBid.bind(this, productSpecKey, deliveryCountryCode, bidReqId)}
                        >Bid</button>
                        ]]
                    }

                    // console.log("==== bidColumnValues = ", bidColumnValues)
                    const bidColumnElems = bidColumnValues.map((rowColumns) => {
                        console.log("==== rowColumns = ", rowColumns)
                        return (
                        [   <td className='number'>{ rowColumns[0] }</td>,
                            <td className='number'>{ rowColumns[1] }</td>,
                            <td className='number'>{ rowColumns[2] }</td>,
                            <td className=''>{ rowColumns[3] }</td>,
                            <td>{ rowColumns[4] }</td>
                        ] )
                    })
                    // console.log("==== bidColumnElems = ", bidColumnElems)

                    let partialRowColumns = ''
                    let partialBidRows = []

                    if (bidColumnElems.length == 1) {
                        partialRowColumns = bidColumnElems[0]
                    } else {
                        partialRowColumns = (<td colSpan='5'></td>)
                        partialBidRows = bidColumnElems
                    }

                    const mainRow = (
                        <tr key={ bidReqId }>
                            <td></td>
                            <td width='3%'></td>
                            <td className=''>{ bidReq.deliveryCity }</td>
                            <td className=''>{ bidReq.incoterm }</td>
                            <td className=''>{ bidReq.deliveryDeadline }</td>
                            <td className='number'>{ bidReq.qty }</td>
                            { partialRowColumns }
                        </tr>
                            )
                    // console.log("==== bid request mainrow = ", mainRow)
                    let bidRow
                    rows.push(mainRow)
                    partialBidRows.forEach(function(partial, idx) {
                        bidRow =
                            <tr key={ `${bidReqId}-${idx}` }>
                                <td colSpan='6'></td>
                                { partial }
                            </tr>

                        rows.push(bidRow)
                    })
                }
            }
        }
        return (<table className='bids'>{ header }
            <tbody>{ rows }</tbody>
        </table>)
    }

    render () {
        const table = this.buildTable()
        return (
            <div id='bids'>
                { table }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidRequestsTable)
