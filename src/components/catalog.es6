import React from 'react'
import { Treebeard } from 'react-treebeard'
import { StyleRoot } from 'radium'
import styles from '../client/styles.es6'
import { connect } from 'react-redux'
import ProductForm from '../components/productForm.es6'

function mapStateToProps(store) {
    return { commodities: store.commodities, rawCatalog: store.rawCatalog }
}

class Catalog extends React.Component {
    constructor(props){
        super(props)
        // console.log("==== rawCat = ", this.props.rawCatalog)
        // this.state = { data: StoreHelpers.getProducts(this.props.rawCatalog), cursor: null }

        const beardedTree = {
            name: 'Catalog',
            toggled: true,
            children: this.props.commodities.categories
        }

        this.state = { data: beardedTree, cursor: null }
        console.log ("==== data ", this.state.data)
        this.onToggle = this.onToggle.bind(this)
    }

    onToggle(node, toggled){
        // console.log(`==== got onToggle with toggled = ${toggled} loading = ${node.loading} and node = `, node);
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }

    // componentWillUpdate(_, nextState) {
    //     console.log("==== app nextState = ", nextState)
    // }

    render () {
        return (
            <div id='catalog'>
                <div className='title'>
                </div>
                <StyleRoot>
                    <div style={styles.component}>
                        <Treebeard
                            style={styles}
                            className='product-tree'
                            data={this.state.data}
                            onToggle={this.onToggle}
                        />
                    </div>
                    <div style={styles.component}>
                        <ProductForm node={this.state.cursor}/>
                    </div>
                </StyleRoot>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Catalog)
