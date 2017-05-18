import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createBid, fetchBidRequests } from '../../shared/actionCreators.es6'
import { CountryDropdown } from 'react-country-region-selector'
import refreshIcon from './assets/Reload-icon.png'

function mapStateToProps(store) {
    return { currentUser: store.currentUser, bidRequests: store.bidRequests, productSpecs: store.productSpecs, commodities: store.commodities }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createBid, fetchBidRequests }, dispatch)
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
        this.props.fetchBidRequests()
    }

    buildTable() {
        const tendersByCommId = this.props.bidRequests
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
            <th className='header' style={{width: '75px'}}>Origin</th>
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
            for (let deliveryCountryCode in tendersByCountry) {
                const deliveryCountryName = window.geoLookup[deliveryCountryCode]['name']
                const row = (<tr key={ `${commodityId}-${deliveryCountryCode}` }>
                    <td width='3%'></td>
                    <td className='country' colSpan='9'>{ deliveryCountryName }</td>
                </tr>)
                // console.log("==== country row = ", row)
                rows.push(row)
                const tenders = tendersByCountry[deliveryCountryCode]
                let rowCount = -1
                for (let tenderId in tenders) {
                    rowCount += 1
                    // console.log("==== tender id = ", tenderId)
                    const tender = tenders[tenderId]
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
                            const originCountryName = window.geoLookup[bid.originCountryCode]['name']
                            return [ bid.id, unitPriceStr, deliveryPriceDisp, totalDisp, originCountryName, button ]
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
                        <CountryDropdown
                                value={ this.state.bids[tenderId] ? this.state.bids[tenderId]['originCountryCode'] : '' }
                                valueType='short'
                                onChange={(val) => this.handleGeoChange(tenderId, 'originCountryCode', val)}
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
                            <td key={ `${key}-orig-cc` } className=''>{ rowColumns[4] }</td>,
                            <td key={ `${key}-button` } >{ rowColumns[5] }</td>
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

                    let description = ''
                    const match = tender.description.match(/\/\s*(.*)$/)  // extract description after first /
                    if (match) {
                        description = match[1]
                    }

                    const style = Math.abs(rowCount % 2) == 1 ? {} : {backgroundColor: '#eafaea'}
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
                    let bidRow
                    rows.push(mainRow)
                    partialBidRows.forEach(function(partial, idx) {
                        bidRow =
                            <tr key={ `${tenderId}-${idx}` }>
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
