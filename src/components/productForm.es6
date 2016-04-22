// based on the NodeViewer component from react-treebeard repo /examples

import React from 'react';
import styles from '../client/styles.es6';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestBid } from '../shared/actionCreators.es6'

const HELP_MSG = 'Select a Product on the Left...';

function mapStateToProps(store) {
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
        this.setState({qty: event.target.value});
    }

    requestBid(productKey) {
        console.log(`==== Bid requested by ${this.props.currentUser.fullName} for qty ${this.state.qty} of product key `, productKey);
        this.props.requestBid(this.props.currentUser.fullName, productKey, this.state.qty)
        this.setState({qty: ''});
    }

    render(){
        console.log("==== props for productForm = ", this.props);
        const style = styles.viewer;
        // let json = JSON.stringify(this.props.node, null, 4);
        console.log("==== this.props.node = ", this.props.node);
        // console.log("==== json = ", json);
        // if(!json){ console.log("==== !json"); json = HELP_MSG; }
        // console.log("==== json = ", json);
        console.log("==== this.props.node == null ", this.props.node == null);
        const name = this.props.node && this.props.node.price ? this.props.node.name : HELP_MSG;
        console.log("==== name = ", name);
        console.log("==== br by name: ", this.props.bidRequests[name]);
        if (this.props.bidRequests[name]) console.log("==== br qry: ", this.props.bidRequests[name][this.props.currentUser.fullName]);
        let requestStatus = '';
        let form = '';
        let qty = 0;
        if (this.props.bidRequests[name] && (qty = this.props.bidRequests[name][this.props.currentUser.fullName])) {
            requestStatus = `Bid request placed for quantity ${qty} of ${name}`;
        } else {
            form = (<div>
                        <span>{name}</span>
                        <input
                            type='text'
                            value={this.state.qty}
                            onChange={this.handleQtyChange.bind(this)}
                        />
                        <button onClick={this.requestBid.bind(this, name)}>Request Bid</button>
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