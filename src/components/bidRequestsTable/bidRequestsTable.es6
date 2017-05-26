import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid, fetchTenders } from '../../shared/actionCreators.es6'
import { CountryDropdown } from 'react-country-region-selector'
import refreshIcon from './assets/Reload-icon.png'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, tenders: store.tenders, tenderTree: store.tenderTree, productSpecs: store.productSpecs, commodities: store.commodities }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createBid, fetchTenders }, dispatch)
}

class BidRequestsTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {bids: {}}  // ie. bids: { tenderId: { pricePerUnit: 1.01 } }
    }

    handleInputChange(tenderId, event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        const bids = this.state.bids
        if (bids[tenderId]) {
            bids[tenderId][name] = value
        } else {
            bids[tenderId] = {[name]: value}
        }
        // console.log("==== setting state with: ", bids)
        this.setState({ bids })
    }

    handleGeoChange(tenderId, name, value) {
        console.log("==== args = ", arguments)
        const bids = this.state.bids
        if (bids[tenderId]) {
            bids[tenderId][name] = value
        } else {
            bids[tenderId] = {[name]: value}
        }
        console.log("==== geo Change setting state with: ", bids)
        this.setState({ bids })
    }

    createBid(productSpecKey, deliveryCountryCode, tenderId) {
        // console.log("==== looking up bid for tenderId: ", tenderId)
        const bid = this.state.bids[tenderId]
        // console.log("==== found bid: ", bid)
        bid.bidRequestIds = [tenderId]
        bid.deliveryCountryCode = deliveryCountryCode
        this.props.createBid(productSpecKey, bid)
    }

    refresh() {
        this.props.fetchTenders()
    }

    calcRowBackground(rowNum) {
        return Math.abs(rowNum % 2) == 1 ? {} : {backgroundColor: '#eafaea'}
    }

    buildTable() {
        const tendersByCommId = this.props.tenderTree
        const tenderColumnCount = 8
        const bidColumnCount = 9
        const header = (<thead>
        <tr key='tableHeader'>
            <th className='header'>
                    <img className='refresh-btn' src={ refreshIcon }
                         onClick={this.refresh.bind(this)} />
            </th>
            <th className='header' colSpan='3'>Destination</th>
            <th className='header' style={{width: '400px'}}>Specs</th>
            <th className='header' style={{width: '20px'}}>Inco-term</th>
            <th className='header' style={{width: '100px'}}>Deadline</th>
            <th className='header right' style={{width: '55px'}}>Qty</th>
            <th className='header right' style={{width: '75px'}}>Unit Price</th>
            <th className='header right' style={{width: '75px'}}>Delivery Price</th>
            <th className='header' style={{width: '75px'}}>Total</th>
            <th className='header' style={{width: '75px'}}>Prepay %</th>
            <th className='header' style={{width: '75px'}}>Payment Terms</th>
            <th className='header' style={{width: '75px'}}>Mfr</th>
            <th className='header' style={{width: '75px'}}>Mfr Code</th>
            <th className='header' style={{width: '75px'}}>Country of Manufacture</th>
            <th></th>
        </tr>
        </thead>)
        let rows = []
        for (let commodityId in tendersByCommId) {
            const commodity = this.props.commodities.commodities[commodityId]
            const row = (<tr key={ commodityId }>
                <td colSpan='10' className='commodity'>{ commodity ? commodity['commodity_name'] : 'Unknown' }</td>
            </tr>)
            // console.log("==== productRow = ", row)
            rows.push(row)
            const tendersByCountry = tendersByCommId[commodityId]
            // console.log("==== tendersByCountry = ", tendersByCountry)
            let rowCount = -1
            for (let deliveryCountryCode in tendersByCountry) {
                const deliveryCountryName = window.geoLookup[deliveryCountryCode]['name']
                const row = (<tr key={ `${commodityId}-${deliveryCountryCode}` }>
                    <td width='3%'></td>
                    <td className='country' colSpan='9'>{ deliveryCountryName }</td>
                </tr>)
                // console.log("==== country row = ", row)
                rows.push(row)
                const tenderIds = tendersByCountry[deliveryCountryCode]
                for (let tenderId of tenderIds) {
                    rowCount += 1
                    // console.log("==== tender id = ", tenderId)
                    const tender = this.props.tenders[tenderId]
                    const deliveryRegionName = window.geoLookup[deliveryCountryCode]['regions'][tender.deliveryRegionCode]
                    // console.log("==== tender = ", tender)
                    let bidColumnValues = [], deliveryPriceDisp = '', totalDisp = '', button = ''
                    // console.log("==== is array: ", Array.isArray(tender.bids ))
                    if (Array.isArray(tender.bids) && tender.bids.length > 0) {
                        // console.log("==== found bids for the request, length = ", tender.bids.length)
                        bidColumnValues = tender.bids.map((bid) => {
                            let deliveryPrice
                            const qty = parseInt(tender.qty)
                            const unitPrice = parseFloat(bid.pricePerUnit)
                            const unitPriceStr = `$${unitPrice}`
                            if (bid.deliveryPrice) {
                                deliveryPrice = parseFloat(bid.deliveryPrice)
                            } else {
                                deliveryPrice = 0
                            }
                            deliveryPriceDisp = `$${deliveryPrice}`
                            totalDisp = `$${(qty * unitPrice) + deliveryPrice}`
                            const prepayPercent = !bid.prepayPercent || bid.prepayPercent == '' ? '' : `${bid.prepayPercent}%`
                            const mfrName = bid.mfrName
                            const originCountryName = window.geoLookup[bid.originCountryCode]['name']
                            return [ bid.id, unitPriceStr, deliveryPriceDisp, totalDisp, prepayPercent, bid.paymentTerms, mfrName, bid.productCode, originCountryName, button ]
                        })
                    } else if (!this.props.readOnly) {
                        // console.log("==== found no bids, building input elems")
                        bidColumnValues = [[
                        0,
                        <input
                            type='text'
                            name='pricePerUnit'
                            size='7'
                            onChange={this.handleInputChange.bind(this, tenderId)}
                        />,
                        <input
                            type='text'
                            name='deliveryPrice'
                            size='7'
                            onChange={this.handleInputChange.bind(this, tenderId)}
                        />,
                        '',
                            // didn't work: value={ this.state[tenderId] ? this.state[tenderId]['originCountryCode'] : '' }
                        <input
                            type='text'
                            name='prepayPercent'
                            size='3'
                            onChange={this.handleInputChange.bind(this, tenderId)}
                        />,
                        <select
                            name='paymentTerms'
                            onChange={this.handleInputChange.bind(this, tenderId)}>
                            <option value=''></option>
                            <option value='Net 7'>Net 7</option>
                            <option value='Net 10'>Net 10</option>
                            <option value='Net 30'>Net 30</option>
                            <option value='Net 45'>Net 45</option>
                            <option value='Net 60'>Net 60</option>
                            <option value='Net 90'>Net 90</option>
                        </select>,
                        <input
                            type='text'
                            name='mfrName'
                            size='7'
                            onChange={this.handleInputChange.bind(this, tenderId)}
                        />,
                        <input
                            type='text'
                            name='productCode'
                            size='7'
                            onChange={this.handleInputChange.bind(this, tenderId)}
                        />,
                        <CountryDropdown
                                value={ this.state.bids[tenderId] ? this.state.bids[tenderId]['originCountryCode'] : '' }
                                valueType='short'
                                onChange={(val) => this.handleGeoChange(tenderId, 'originCountryCode', val)}
                                defaultOptionLabel='Country of Manufacture'
                        />,
                        <button
                            onClick={this.createBid.bind(this, commodityId, deliveryCountryCode, tenderId)}>
                            Bid
                        </button>
                        ]]
                    }

                    // console.log("==== bidColumnValues = ", bidColumnValues)
                    // even though these column td's are wrapped in a tr with a unique key, React complains since these td's are delivered in an array if they don't have unique keys
                    const bidColumnElems = bidColumnValues.map((rowColumns) => {
                        // console.log("==== rowColumns = ", rowColumns)
                        const key = `${tenderId}-${rowColumns[0]}`   // tenderId-bidId, for input fields (ie no saved bid), bidId is 0
                        return (
                        [   <td key={ `${key}-unit-price` } className='number'>{ rowColumns[1] }</td>,
                            <td key={ `${key}-del-price` } className='number'>{ rowColumns[2] }</td>,
                            <td key={ `${key}-total` } className='number'>{ rowColumns[3] }</td>,
                            <td key={ `${key}-prepay-percent` } className='number'>{ rowColumns[4] }</td>,
                            <td key={ `${key}-payment-terms` } className='number'>{ rowColumns[5] }</td>,
                            <td key={ `${key}-mfr` } className='number'>{ rowColumns[6] }</td>,
                            <td key={ `${key}-mfr-code` } className=''>{ rowColumns[7] }</td>,
                            <td key={ `${key}-orig-cc` } className=''>{ rowColumns[8] }</td>,
                            <td key={ `${key}-button` } >{ rowColumns[9] }</td>
                        ] )
                    })
                    // console.log("==== bidColumnElems = ", bidColumnElems)

                    let partialRowColumns = ''
                    let partialBidRows = []

                    const bidCount = bidColumnElems.length
                    // console.log(`==== tender ${tenderId} has ${bidCount} bids`)
                    if (bidCount > 0) { // there is only one bid for this tender
                        partialRowColumns = bidColumnElems[0]
                        if (bidCount > 1) {
                            partialBidRows = bidColumnElems.slice(1, bidCount)
                            // console.log("==== partialBidRows length = ", partialBidRows.length)
                        }
                    } else {
                        partialRowColumns = (<td colSpan={bidColumnCount}></td>)  // leave columns to right of tender empty when multiple bids
                    }

                    let description = ''
                    const match = tender.description.match(/\/\s*(.*)$/)  // extract description after first /
                    if (match) {
                        description = match[1]
                    }

                    const style = this.calcRowBackground(rowCount)
                    // console.log(`==== building row with key tenderId ${tenderId}`)
                    const mainRow = (
                        <tr key={ tenderId } style={style}>
                            <td></td>
                            <td width='3%'></td>
                            <td className='' style={{width: '100px'}}>{ deliveryRegionName }</td>
                            <td className='' style={{width: '100px'}}>{ tender.deliveryCity }</td>
                            <td className=''>{ description }</td>
                            <td className=''>{ tender.incoterm }</td>
                            <td className=''>{ tender.deliveryDeadline }</td>
                            <td className='number'>{ tender.qty }</td>
                            { partialRowColumns }
                        </tr>
                            )
                    // console.log("==== bid request mainrow = ", mainRow)
                    rows.push(mainRow)
                    partialBidRows.forEach(function(partial, idx) {
                        const bidRow =
                            <tr key={ `${tenderId}-${idx}` } style={style}>
                                <td colSpan={tenderColumnCount}></td>
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
