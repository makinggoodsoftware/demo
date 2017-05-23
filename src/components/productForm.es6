// based on the NodeViewer component from react-treebeard repo /examples

import React from 'react'
import styles from '../client/styles.es6'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { submitTender } from '../shared/actionCreators.es6'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import ProductProperties from './productProperties/productProperties.es6'

const HELP_MSG = '<-- To Enter a Tender, Select a Product Specification to the Left';

// see https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
function mapStateToProps(store) { // React calls this whenever the part of the store we're subscribed to has changed
    return { xhrs: store.xhrs, currentUser: store.currentUser, commodities: store.commodities, bidRequests: store.bidRequests }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitTender }, dispatch)
}

class ProductForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {commodityProps: {}, commodityDescription: '', qty: '', deliveryCity: '', deliveryRegionCode: '',deliveryCountryCode: '', deliveryBidRequested: false, incoterm: 'CIP', defaultDeliveryDeadline: ''}
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

    handlePropertiesFormChange(commodityProps, commDescription) {
        // const target = event.target
        // const value = target.type === 'checkbox' ? target.checked : target.value
        // const name = target.name
        // console.log(`==== productForm setting commodity Property ${name} to ${value}`)
        //
        // const commProps = this.state.commodityProps
        // commProps[name] = value
        this.setState({
            commodityProps: commodityProps,
            commodityDescription: commDescription
        })
    }

    submitTender(commodityId) {
        const xhrId = `${commodityId}-${Date.now()}`

        console.log(`==== Bid requested by ${this.props.currentUser.fullName} (user ${this.props.currentUser.id}) for qty ${this.state.qty} of commodity id ${commodityId} '${this.state.commodityDescription}' delivered by ${this.deliveryDeadlineInput.value}`)
        const tender = (({ qty, deliveryCity, deliveryRegionCode, deliveryCountryCode, deliveryBidRequested, incoterm }) => ({ qty, deliveryCity, deliveryRegionCode, deliveryCountryCode, deliveryBidRequested, incoterm }))(this.state)
        tender.xhrId = xhrId
        tender.commodityId = commodityId
        tender.description = this.state.commodityDescription  // #TODO: include in the larger assignment from state
        tender.deliveryDeadline = this.deliveryDeadlineInput.value
        this.setState({ xhrId, defaultDeliveryDeadline: tender.deliveryDeadline })
        // console.log("==== productForm tender = ", tender)
        this.props.submitTender(this.props.currentUser.id, tender)
        this.setState({qty: ''}) // #TODO: combine with other setState
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

    getIolPropRules() {
        const diopterOpts = []
        for (let i = -100; i <= 400; i = i + 5) {
            const valueStr = i == 0 ? '+0' : (i > 0 ? `+${i / 10}` : i / 10)
            diopterOpts.push({e: 'option', p: {key: `diopter-${i}`, value: valueStr}, c: valueStr})
        }

        const cylinderOpts = [{e: 'option', p: {key: `cylinder-0`, value: '+0'}, c: '+0'}]
        for (let i = 15; i <= 60; i = i + 5) {
            const valueStr = i > 0 ? `+${i / 10}` : i / 10
            cylinderOpts.push({e: 'option', p: {key: `cylinder-${i}`, value: valueStr}, c: valueStr})
        }

        // return new class PropertyRules {
        const propRules =  {
            displayFn(value) {
                const displayValues = {
                    mono: 'Monofocal', bi: 'Bifocal', multi: 'Multifocal', pmma: 'PMMA',
                    hydrophilic: 'Hydrophilic', hydrophobic: 'Hydrophobic', 1: '1-piece', 3: '3-piece',
                    round: 'Round', square: 'Square', true: 'Yes', false: 'No', zero: 'Zero', negative: 'Negative',
                    transparent: 'Transparent', yellow: 'Yellow'
                }
                return displayValues[value] || value
            },

            elements: [
                {e: 'select', p: {label: 'Optics', name: 'optics', key: 'select-optic'}, c: [
                    {e: 'option', p: {key: 'optic-mono', value: 'mono'} },
                    {e: 'option', p: {key: 'optic-bi', value: 'bi'} },
                    {e: 'option', p: {key: 'optic-multi', value: 'multi'} }]},
                {e: 'select', p: {label: 'Material', name: 'material', key: 'select-material'}, c: [
                    {e: 'option',  p: {key: 'material-null'} },
                    {e: 'option', p: {key: 'material-pmma', value: 'pmma'} },
                    {e: 'option', p: {key: 'material-hydrophilic', value: 'hydrophilic'} },
                    {e: 'option', p: {key: 'material-hydrophobic', value: 'hydrophobic'} }]},
                {e: 'select', p: {label: 'Pieces', name: 'pieces', key: 'select-pieces'}, c: [
                    {e: 'option',  p: {key: 'pieces-null'} },
                    {e: 'option', p: {key: 'pieces-1', value: '1'} },
                    {e: 'option', p: {key: 'pieces-3', value: '3'} }]},
                {e: 'select', p: {label: 'Position Holes', name: 'positionHoles', key: 'select-position-holes'}, c: [
                    {e: 'option', p: {key: 'holes-0', value: '0'} },
                    {e: 'option', p: {key: 'holes-2', value: '2'} }]},
                {e: 'select', p: {label: 'Edge', name: 'edge', key: 'select-edge'}, c: [
                    {e: 'option', p: {key: 'edge-round', value: 'round' } },
                    {e: 'option', p: {key: 'edge-square', value: 'square'} }]},

                {e: 'select', p: {label: 'Diopter', name: 'diopter', key: 'select-diopter'}, c: diopterOpts},

                {e: 'span', p: {label: 'Optic Diameter ⌀', key: 'span-optic-dia'}, c: [{e: 'input',
                    p: {name: 'opticDiameter', type: 'text', key: 'input-optic-dia', size: 3} }, ' mm']},

                {e: 'span', p: {label: 'Overall Diameter ⌀', key: 'span-overall-dia'}, c: [{e: 'input',
                    p: {name: 'overallDiameter', type: 'text', key: 'input-overall-dia', size: 4} }, ' mm']},

                {e: 'select', p: {label: 'Aspheric', name: 'aspheric', key: 'select-aspheric'}, c: [
                    {e: 'option', p: {key: 'aspheric-false', value: 'false'} },
                    {e: 'option', p: {key: 'aspheric-zero', value: 'zero'} },
                    {e: 'option', p: {key: 'aspheric-negative', value: 'negative'} }]},

                {e: 'select', p: {label: 'Chromophore', name: 'chromophore', key: 'select-chromophore'}, c: [
                    {e: 'option', p: {key: 'chromophore-transparent', value: 'transparent'} },
                    {e: 'option', p: {key: 'chromophore-yellow', value: 'yellow'} }]},

                {e: 'select', p: {label: 'Cylinder', name: 'cylinder', key: 'select-cylinder'}, c: cylinderOpts},

                {e: 'select', p: {label: 'Scleral fixation', name: 'scleral', key: 'select-scleral'}, c: [
                    {e: 'option', p: {key: 'scleral-false', value: 'false'} },
                    {e: 'option', p: {key: 'scleral-true', value: 'true'} }]}
            ],

            defaults: {
                optics: 'mono', diopter: '+0', opticDiameter: '6', overallDiameter: '12', aspheric: 'false', chromophore: 'transparent', cylinder: '+0',
                scleral: 'false', positionHoles: '0', edge: 'round'
            },

            descriptionFn(commodityName, commodityProps) {
                const positionHoles = commodityProps.positionHoles && commodityProps.positionHoles == '0' ? '' : `${commodityProps.positionHoles} Holes`
                const edge = commodityProps.edge == 'square' ? 'square' : ''
                const aspheric = commodityProps.aspheric && commodityProps.aspheric != 'false' ? `Aspheric ${commodityProps.aspheric}` : ''
                const opticDiameter = commodityProps.opticDiameter ? `Opt ⌀${commodityProps.opticDiameter} mm` : ''
                const overallDiameter = commodityProps.overallDiameter ? `Overall ⌀${commodityProps.overallDiameter}mm` : ''
                const chromophore = commodityProps.chromophore && commodityProps.chromophore == 'yellow' ? 'Yellow' : ''
                const cylinder = commodityProps.cylinder && commodityProps.cylinder == '+0' ? '' : `Cylinder ${commodityProps.cylinder}`
                const scleral = commodityProps.scleral && commodityProps.scleral == 'true' ? 'Scleral fixation' : ''
                console.log("==== descriptionFn commodityProps = ", commodityProps)
                // console.log("==== propRules.displayFn = ", propRules.displayFn)
                return [commodityName,
                    propRules.displayFn(commodityProps.optics),
                    propRules.displayFn(commodityProps.material),
                    propRules.displayFn(commodityProps.pieces),
                    propRules.displayFn(positionHoles),
                    propRules.displayFn(edge),
                    propRules.displayFn(commodityProps.diopter),
                    propRules.displayFn(opticDiameter),
                    propRules.displayFn(overallDiameter),
                    propRules.displayFn(aspheric),
                    propRules.displayFn(chromophore),
                    propRules.displayFn(cylinder),
                    propRules.displayFn(scleral),
                ].filter(str => str).join(' / ')
            }

        }
        return propRules
    }

    getPropertyRules() {
        const commodityId = this.props.node.id
        let propertyRules
        if (commodityId == '42295524') {
            propertyRules = this.getIolPropRules()
        }
        else {
            // elements in order of display, defaults keys must match the 'name' of the HTML element returned by sharedPropertyElements()
            console.log("==== productForm, PRESET PROPERTY!!!!")
            // propertyRules = {
            //     elements: ['solution', 'volume'],
            //     defaults: {solution: 1, volume: 5},
            // }
            propertyRules = this.props.commodities.commodities[commodityId].property_rules
            console.log("==== found property_rules: ", propertyRules)
        }
        if (!propertyRules.defaults) {
            propertyRules.defaults = {}
        }
        return propertyRules
    }

    componentDidMount() {
        var Pikaday = require('pikaday')
        window['Pikaday'] = Pikaday  // a hack to make library available
    }

    render() {
        console.log("==== rendering productForm for ", this.props.node ? `${this.props.node.id}: ${this.props.node.name}` : 'no node')
        const style = styles.viewer
        const userId = this.props.currentUser.id
        let requestStatus = ''
        let form = ''
        let bidReq
        let qty = 0
        let commodityId  // #TODO: move this to state, set in constructor and cWRP ?
        let node_type = null
        let productSpecDescription
        if (this.props.node) {
            node_type = 'category'
            if (this.props.node.id.slice(-2) != '00') {
                node_type = 'commodity'
                commodityId = this.props.node.id
            }
        }
        let statusText = null
        if (this.state.xhrId) {
            const xhrStatus = this.props.xhrs[this.state.xhrId]
            statusText = xhrStatus ? xhrStatus.statusText : ''
            if (typeof xhrStatus.errors == 'string') {
                statusText += `: ${xhrStatus.errors}`
            } else if (xhrStatus.errors) {  // if it exists, assume it's an object of format {field_name: error_text}
                const res = Object.keys(xhrStatus.errors).reduce((result, key) => {
                    return result + `${key}: ${xhrStatus.errors[key]}\r\n`
                }, '')
                console.log("==== res = ", res)
                statusText = statusText + ":\r\n" + res
            }
        }

        // if (this.props.bidRequests[commodityId]) console.log(`==== br for prod `, this.props.bidRequests[commodityId])
        // if (this.props.bidRequests[commodityId] && this.props.bidRequests[commodityId][userId]) console.log(`==== br for user for prod `, this.props.bidRequests[commodityId][userId])
        // console.log(`==== userId = ${userId}, commodityId = ${commodityId}`)
        if (false) {
        // if (this.props.bidRequests[commodityId]) {
            // console.log("==== br qty: ", qty)

            const deliveryCountryCode = Object.keys(this.props.bidRequests[commodityId])[0] // assumes buyer can only place one bid request per product
            const bidReqsByCountry = this.props.bidRequests[commodityId][deliveryCountryCode]
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
            requestStatus = `Requested bid for ${bidReq.qty} of '${bidReq.description}' ${deliveryBid}delivered to ${bidReq.deliveryCity}, ${deliveryRegionName}, ${deliveryCountryName} ${deliveryDeadline}`
        } else if (node_type != 'commodity') {
            requestStatus = HELP_MSG
        } else {
            form = (<div>
                        <div className='product-desc'>
                            { this.state.commodityDescription }
                        </div>
                        <ProductProperties
                            commodityId={ this.props.node.id }
                            commodityName={ this.props.commodities.commodities[this.props.node.id].commodity_name }
                            commodityPropRules= { this.getPropertyRules() }
                            parentEvtHandler={this.handlePropertiesFormChange.bind(this)}
                        />
                        <div>
                            <span className='request-qty'>
                                <span className='required-symbol'>*</span>
                                Quantity:
                                <input
                                    name='qty'
                                    type='text'
                                    size='10'
                                    value={this.state.qty}  // setting value here makes this a React controlled component
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </span>
                        </div>
                        <div className='delivery-heading'>
                            Delivery To:
                        </div>
                        <div>
                            <span className='request-country'>
                                <span className='required-symbol'>*</span>
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
                                <span className='required-symbol'>*</span>
                                Region:
                                <RegionDropdown
                                    country={this.state.deliveryCountryCode}
                                    countryValueType='short'
                                    valueType='short'
                                    value={this.state.deliveryRegionCode}
                                    onChange={(val) => this.handleGeoChange('deliveryRegionCode', val)}
                                />
                            </span>
                        </div>
                        <div>
                            <span className='request-city'>
                                <span className='required-symbol'>*</span>
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
                                <select
                                    name='incoterm'
                                    value={this.state.incoterm}
                                    onChange={this.handleInputChange.bind(this)}>
                                    <option value='CIP'>CIP</option>
                                    <option value='CPT'>CPT</option>
                                    <option value='DAP'>DAP</option>
                                    <option value='DAT'>DAT</option>
                                    <option value='DDP'>DDP</option>
                                    <option value='EXW'>EXW</option>
                                    <option value='FCA'>FCA</option>
                                    <option value='FOB'>FOB</option>
                                </select>
                            </span>
                        </div>
                        <div>
                            Delivery deadline:
                            {/*the date input is not a controlled React component because pikaday doesn't trigger the onChange event*/}
                            <input
                                type='text'
                                id='datepicker'
                                defaultValue={this.state.defaultDeliveryDeadline}
                                ref={(input) => { this.deliveryDeadlineInput = input; this.bindPikaday(input) }}
                            />
                        </div>
                        <div>
                            <span className='required-symbol'>*</span>required fields
                        </div>
                        <div>
                            <button className='submitTenderBtn' onClick={this.submitTender.bind(this, commodityId)}>Submit Tender</button>
                        </div>
                        <div>
                            <span className='status-text'>
                                { statusText }
                            </span>
                        </div>
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