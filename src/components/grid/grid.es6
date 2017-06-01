import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getAgGridModule } from '../../shared/actionCreators.es6'
// import {AgGridReact} from 'ag-grid-react'
import 'ag-grid-root/dist/styles/ag-grid.css'  // see webpack config for alias of 'ag-grid-root'
import 'ag-grid-root/dist/styles/theme-fresh.css'

function mapStateToProps(store) {
    return { commodities: { commodities: { 42295524: {commodity_name: "Intraocular lens IOL"} } } }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch)
}

class Grid extends React.Component {
    constructor(props) {
        super(props)
        this.stuff = {
            columnDefs: [
                {headerName: 'Product', rowGroupIndex: 0, valueGetter: this.gridGetCommodityName.bind(this)},
                // {headerName: 'Country', field: 'deliveryCountryCode'},
                {headerName: 'Country', rowGroupIndex: 1, valueGetter: this.gridGetCountryName.bind(this)},
                // {headerName: 'Region', field: 'deliveryRegionCode'},
                {headerName: 'Region', valueGetter: this.gridGetRegionName.bind(this)},
            ],
            rowData: [{
                commodityId: 42295524,
                deliveryCountryCode: "BW",
                deliveryRegionCode: "KL",
            }]
        }

    }

    gridGetCountryName(gridParams) {
        console.log("==== gridParams getCountryName = ", gridParams)
        return this.getCountryName(gridParams.data.deliveryCountryCode)
    }

    gridGetRegionName(gridParams) {
        console.log("==== gridParams getRegionName = ", gridParams)
        return this.getRegionName(gridParams.data.deliveryCountryCode, gridParams.data.deliveryRegionCode)
    }

    gridGetCommodityName(gridParams) {
        console.log("==== gridParams getCommodityName = ", gridParams)
        return this.getCommodityName(gridParams.data.commodityId)
    }

    getCountryName(countryCode) {
        return window.geoLookup[countryCode]['name']
    }

    getRegionName(countryCode, regionCode) {
        return window.geoLookup[countryCode]['regions'][regionCode]
    }

    getCommodityName(commodityId) {
        console.log("==== commodities = ", this.props.commodities.commodities)
        return this.props.commodities.commodities[commodityId]['commodity_name']
    }

    onGridReady(params) {
        console.log("==== ag-grid ready, params = ", params)
        this.api = params.api
        this.columnApi = params.columnApi
        this.columnApi.autoSizeColumns(this.columnApi.getAllGridColumns())
    }

    render() {
        console.log("==== all rowData :", this.stuff.rowData)
        console.log("==== rendering Grid with rowData :", this.stuff.rowData.slice)

        const AgGridReact = window.agGridReact
        // when loaded with a regular import at the top of the file, AgGridReact returns: function (props, context, updater) {if (process.env.NODE_ENV !== 'production'…
        // when loaded with an async import() (see first commit to ag-grid branch) it returns an object -- why the difference?
        console.log("==== agGridModule found, = ", AgGridReact)
        return (
            <div id='grid' className='ag-fresh'>
                <div>
                    Here's the grid...
                </div>
                <AgGridReact
                    columnDefs={this.stuff.columnDefs}
                    rowData={this.stuff.rowData}
                />
            </div>)
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)