import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getAgGridModule } from '../../shared/actionCreators.es6'
// import {AgGridReact} from 'ag-grid-react'
import 'ag-grid-root/dist/styles/ag-grid.css'  // see webpack config for alias of 'ag-grid-root'
import 'ag-grid-root/dist/styles/theme-fresh.css'

function mapStateToProps(store) {
    return { agGridModule: store.agGridModule }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAgGridModule }, dispatch)
}

class Grid extends React.Component {
    constructor(props) {
        super(props)
        if (!props.agGridModule) {
            console.log("==== Grid constructor didn't find agGridModule, getting it now")
            props.getAgGridModule()
        }
        this.state = { columnDefs: [{headerName: 'Product', field: 'product'}, {headerName: 'Country', field: 'country'}],
                        rowData: [{product: 'IOL', country: 'US'}, {product: 'Suture', country: 'IN'}]}
    }

    onGridReady(params) {
        console.log("==== ag-grid ready, params = ", params)
        this.api = params.api
        this.columnApi = params.columnApi
    }

    render() {
        console.log("==== rendering Grid")

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

                    // listen for events with React callbacks
                    onGridReady={this.onGridReady.bind(this)}
                    // onRowSelected={this.onRowSelected.bind(this)}
                    // onCellClicked={this.onCellClicked.bind(this)}

                    // binding to properties within React State or Props
                    showToolPanel={this.state.showToolPanel}
                    quickFilterText={this.state.quickFilterText}
                    icons={this.state.icons}

                    // column definitions and row data are immutable, the grid
                    // will update when these lists change
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}

                    // or provide props the old way with no binding
                    rowSelection="multiple"
                    enableSorting="true"
                    enableFilter="true"
                    rowHeight="22"
                />
            </div>)
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)