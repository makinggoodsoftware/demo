// based on the NodeViewer component from react-treebeard repo /examples

import React from 'react';
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestBid } from '../shared/actionCreators.es6'

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
        super(props);
        this.state = {qty: ''};
    }

    handleQtyChange(event) {
        // console.log("==== product qty change event: ", event);
        this.setState({qty: event.target.value});
    }

    requestBid(productKey) {
        // console.log(`==== Bid requested by ${this.props.currentUser.fullName} for qty ${this.state.qty} of product key `, productKey);
        this.props.requestBid(this.props.currentUser.fullName, productKey, this.state.qty)
        this.setState({qty: ''});
    }

    render(){
        const style = styles.viewer;

        let requestStatus = '';
        let form = '';
        let qty = 0;
        let productSpecId
        let productName = 'no product selected'
        if (this.props.node && this.props.node.price) {
            productSpecId = this.props.node.id
            productName = this.props.node.name
        }
        if (this.props.bidRequests[productSpecId]) console.log("==== br qty: ", this.props.bidRequests[productSpecId][this.props.currentUser.fullName])
        if (this.props.bidRequests[productSpecId] && (qty = this.props.bidRequests[productSpecId][this.props.currentUser.fullName])) {
            requestStatus = `Requested bid for ${qty} of ${productName}`
        } else if (!(this.props.node && this.props.node.price)) {
            requestStatus = HELP_MSG
        } else {
            form = (<div>
                        <span>{this.props.node.name}</span>
                        <span className='request-qty'>
                            Qty:
                            <input
                                type='text'
                                value={this.state.qty}  // setting value here makes this a React controlled component
                                onChange={this.handleQtyChange.bind(this)}
                            />
                            <button onClick={this.requestBid.bind(this, productSpecId)}>Request Bid</button>
                        </span>
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