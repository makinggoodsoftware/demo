import Immutable from 'immutable';

let storeHelpers = {
    beardedNode: function (node) {
        // console.log("==== beardedNode begin, node passed in = ", node);
        const keys = Object.keys(node);
        // console.log("==== node passed in, keys = ", keys);
        const nodeFirstObj = node[keys[0]];
        // const firstNodeKeys = Object.keys(nodeFirstObj); // the keys will be product id integers if this category has no sub-categories
        // console.log("==== first keys = ", firstNodeKeys);
        if ('name' in nodeFirstObj) {  // assumes no mixed categories (ie. category cannot contain both categories and products)
            // node is an actual product, not category
            // console.log("==== Product, not category");
            const products = keys.map((key => {
                return node[key]
            }));
            // console.log("==== returning products:  ", products);
            return products;
        } else {
            // console.log("==== Category, not product");
            const categories = [];
            keys.forEach((key) => {
                categories.push ({
                    name: key,
                    toggled: false,
                    children: this.beardedNode(node[key])
                })
            });
            // console.log("==== returning categories: ", categories);
            return categories;
        }
    },

    productTree: function (rawCatalog) {
        let tree = Immutable.Map({})
        rawCatalog.forEach((product, index) => {
            const prodObj = {name: product[2], price: product[3], id: product[4]}
            tree = tree.setIn([product[0], product[1], index], prodObj)
        })
        // console.log("==== tree = ", tree.toJS());
        return tree
    },

    getProducts: function (rawCatalog) {
        const productTree = this.productTree(rawCatalog);
        // console.log("==== productTree = ", productTree.toJS());
        const productObj = productTree.toJS();
        // let beardedTree = {};
        let children = [];
        let beardedNode;
        children = this.beardedNode(productObj);

        const beardedTree = {
            name: 'Ophthalmic',
            toggled: true,
            children: children
        };

        // console.log("==== beardedTree = ", beardedTree);

        // const test = {
        //     name: 'root',
        //     toggled: true,
        //     children: [
        //         {
        //             name: 'parent',
        //             toggled: true,
        //             children: [
        //                 {name: 'child1'},
        //                 {name: 'child2'}
        //             ]
        //         },
        //         {
        //             name: 'loading parent',
        //             loading: true,
        //             children: []
        //         },
        //         {
        //             name: 'parent',
        //             children: [
        //                 {
        //                     name: 'nested parent',
        //                     children: [
        //                         {name: 'nested child 1'},
        //                         {name: 'nested child 2'}
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // };

        return beardedTree
    }
};

export default storeHelpers;

