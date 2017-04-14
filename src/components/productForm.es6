// based on the NodeViewer component from react-treebeard repo /examples

import React from 'react';
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestBid } from '../shared/actionCreators.es6'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

const HELP_MSG = '<-- To Request a Bid, First Select a Product to the Left';

// see https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
function mapStateToProps(store) { // React calls this whenever the part of the store we're subscribed to has changed
    return { currentUser: store.currentUser, bidRequests: store.bidRequests }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ requestBid }, dispatch)
}

class ProductForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {qty: '', deliveryCity: '', deliveryRegionCode: '',deliveryCountryCode: '', deliveryBidRequested: false, incoterm: '', defaultDeliveryDeadline: ''}
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleGeoChange(name, value) {
        this.setState({
            [name]: value
        })
    }

    requestBid(productKey) {
        console.log(`==== Bid requested by ${this.props.currentUser.fullName} (user ${this.props.currentUser.id}) for qty ${this.state.qty} of product key ${productKey} delivered by ${this.deliveryDeadlineInput.value}`)
        const bidReq = (({ qty, deliveryCity, deliveryRegionCode, deliveryCountryCode, deliveryBidRequested, incoterm }) => ({ qty, deliveryCity, deliveryRegionCode, deliveryCountryCode, deliveryBidRequested, incoterm }))(this.state)
        bidReq.productSpecId = productKey
        bidReq.deliveryDeadline = this.deliveryDeadlineInput.value
        this.setState({defaultDeliveryDeadline: bidReq.deliveryDeadline})
        // console.log("==== productForm bidReq = ", bidReq)
        // this.props.requestBid(this.props.currentUser.id, productKey, this.deliveryDeadlineInput.value, this.state.deliveryCity, this.state.deliveryCountryCode, this.state.deliveryBidRequested, this.state.incoterm)
        this.props.requestBid(this.props.currentUser.id, bidReq)
        this.setState({qty: ''})
    }

    bindPikaday(elem) {
        // consider using https://github.com/thomasboyt/react-pikaday
        // console.log("==== elem = ", elem)
        if (elem) {
            this.picker = new Pikaday({field: elem})
        } else if (this.picker) {
            this.picker.destroy()
        }
        // console.log("==== after binding: picker = ", this.picker)
    }

    componentDidMount() {
        var Pikaday = require('pikaday')
        window['Pikaday'] = Pikaday  // a hack to make library available
    }

    render(){
        const style = styles.viewer
        const userId = this.props.currentUser.id
        let requestStatus = ''
        let form = ''
        let bidReq
        let qty = 0
        let productSpecId
        let productName = 'no product selected'
        if (this.props.node && this.props.node.price) {
            productSpecId = this.props.node.id
            productName = this.props.node.name
        }
        // if (this.props.bidRequests[productSpecId]) console.log(`==== br for prod `, this.props.bidRequests[productSpecId])
        // if (this.props.bidRequests[productSpecId] && this.props.bidRequests[productSpecId][userId]) console.log(`==== br for user for prod `, this.props.bidRequests[productSpecId][userId])
        // console.log(`==== userId = ${userId}, productSpecId = ${productSpecId}`)
        if (this.props.bidRequests[productSpecId]) {
            // console.log("==== br qty: ", qty)

            const deliveryCountryCode = Object.keys(this.props.bidRequests[productSpecId])[0] // assumes buyer can only place one bid request per product
            const bidReqsByCountry = this.props.bidRequests[productSpecId][deliveryCountryCode]
            // console.log("==== bidReqsByCountry = ", bidReqsByCountry)
            const bidReqId = Object.keys(bidReqsByCountry)[0] // assumes buyer can only place one bid request per product
            const bidReq = bidReqsByCountry[bidReqId]
            // console.log("==== found bidReq = ", bidReq)
            const deliveryDeadline = bidReq.deliveryDeadline ? `by ${bidReq.deliveryDeadline}` : ''
            const deliveryBid = bidReq.deliveryBidRequested ? `and delivery costs via ${bidReq.incoterm} ` : ''
            const deliveryCountry = window.geoLookup[deliveryCountryCode]
            // console.log("==== deliCoun", deliveryCountry)
            const deliveryCountryName = deliveryCountry['name']
            // console.log("==== countr name ", deliveryCountryName)
            const deliveryRegionName = deliveryCountry['regions'][bidReq.deliveryRegionCode]
            // console.log("==== region name ", deliveryRegionName)
            requestStatus = `Requested bid for ${bidReq.qty} of '${productName}' ${deliveryBid}delivered to ${bidReq.deliveryCity}, ${deliveryRegionName}, ${deliveryCountryName} ${deliveryDeadline}`
        } else if (!(this.props.node && this.props.node.price)) {
            requestStatus = HELP_MSG
        } else {
            form = (<div>
                        <div>
                            {this.props.node.name}
                        </div>
                        <div>
                            <span className='request-qty'>
                                Qty:
                                <input
                                    name='qty'
                                    type='text'
                                    value={this.state.qty}  // setting value here makes this a React controlled component
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </span>
                        </div>
                        <div>
                            <span className='request-country'>
                                Country:
                                <CountryDropdown
                                    value={this.state.deliveryCountryCode}
                                    valueType='short'
                                    onChange={(val) => this.handleGeoChange('deliveryCountryCode', val)}
                                />
                            </span>
                        </div>
                        <div>
                            <span className='request-region'>
                                Region:
                                <RegionDropdown
                                    country={this.state.deliveryCountryCode}
                                    countryValueType='short'
                                    valueType='short'
                                    value={this.state.deliveryRegionCode}
                                    onChange={(val) => this.handleGeoChange('deliveryRegionCode', val)}
                                />
                            </span>
                            <span className='request-city'>
                                City:
                                <input
                                    name='deliveryCity'
                                    type='text'
                                    value={this.state.deliveryCity}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </span>
                        </div>
                        <div>
                            <span className='request-delivery-bid'>
                                Include bid for delivery costs?
                                <input
                                    name='deliveryBidRequested'
                                    type='checkbox'
                                    checked={this.state.deliveryBidRequested}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </span>
                            <span>
                                Incoterm:
                                <input
                                    name='incoterm'
                                    type='text'
                                    value={this.state.incoterm}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </span>
                        </div>
                        <div>
                            Delivery deadline (optional):
                            {/*the date input is not a controlled React component because pikaday doesn't trigger the onChange event*/}
                            <input
                                type='text'
                                id='datepicker'
                                defaultValue={this.state.defaultDeliveryDeadline}
                                ref={(input) => { this.deliveryDeadlineInput = input; this.bindPikaday(input) }}
                            />
                        </div>
                        <button onClick={this.requestBid.bind(this, productSpecId)}>Request Bid</button>
                    </div>
                    )
        }
        return (
            <div style={style.base}>
                <div>{requestStatus}</div>
                { form }
            </div>
        );
    }
}

ProductForm.propTypes = {
    node: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm)