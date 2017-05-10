import React from 'react'
// import Select from 'react-select'
// import s from 'react-select/dist/react-select.css'
// import withStyles from 'isomorphic-style-loader/lib/withStyles'

class ProductProperties extends React.Component {
    // make this a functional component since all state is in parent?

    constructor(props) {
        super(props)
    }

    //
    buildElement(paramObj, ...children) {  // recursively builds children of element
        const type = paramObj.t
        let props = paramObj.p
        console.log(`==== buildElement received type '${type}', props: `, props)
        console.log("==== buildElement received children ", children)
        if (type != 'option') {
            // #TODO: pass initial default values up to parent (user may not change them)
            props = Object.assign(props ? props : {}, {onChange: this.props.changeEvtHandler})
        }
        // if (Array.isArray(children)) {  // always true if we are glomming that parameter
            // console.log("==== children passed in isArray")
            children = children.map(child => {
                if (typeof child !== 'object' || child === null || (child['$$typeof'] && child['$$typeof'].toString() == "Symbol(react.element)")) {  // hack to tell if child has already been built by React.createElement
                    // child is string or an-already-constructed-ReactElement or ?
                    // console.log("==== returning child: ", child)
                    return child
                } else {   // another element needs building
                    // console.log(`==== child is object, building element with type ${child.t}, props: `, child.p)
                    // console.log(`==== child is object, building element with grandchildren: `, child.c)
                    const grandchildren = Array.isArray(child.c) ? child.c : [child.c]
                    // console.log(`==== child is object, building elem with massaged grandchild: `, grandchildren)
                    return this.buildElement({t: child.t, p: child.p}, ...grandchildren)
                }
            })
            console.log("==== built children = ", children)
        // } else {
        //     console.log("==== glommed param was NOT an array !")
        // }
        // passing undefined or null or array of same as a child of an input element causes React to choke
        children = children.filter(child => child) // removes null values
        const newElem = children.length == 0 ? React.createElement(type, props) : React.createElement(type, props, children)

        return newElem
    }

    render() {
        const e = React.createElement
        let elemParamsA

        // #TODO: take some of this prep work out of render loop

        if (this.props.commodityId != '42295524') {
            console.log("==== NOT IOL !!")
            elemParamsA = [
                {t: 'input', p: { name: 'sample', key: 'free', type: 'text', value: 'default text' }}
            ]
        } else {
            console.log("==== IOL !!")
            const diopterOpts = []
            for(let i = -100; i <= 400; i = i + 5) {
                const child = i == 0 ? '0' : (i > 0 ? `+${i/10}` : i/10)
                diopterOpts.push({t: 'option', p: {key: `diopter-${i}`, value: i}, c: child})
            }

            elemParamsA = [
                {t: 'select', p: {label: 'Optics', name: 'optics', key: 'select-optic'}, c: [
                    {t: 'option', p: {key: 'optic-mono', value: 'mono', default: true}, c: 'Monofocal'},
                    {t: 'option', p: {key: 'optic-bi', value: 'bi'}, c: 'Bifocal'},
                    {t: 'option', p: {key: 'optic-multi', value: 'multi'}, c: 'Multifocal'}
                ]},
                {t: 'select', p: {label: 'Material', name: 'material', key: 'select-material'}, c: [
                    {t: 'option', p: {key: 'material-pmma', value: 'pmma', default: true}, c: 'PMMA'},
                    {t: 'option', p: {key: 'material-hydrophilic', value: 'hydrophilic'}, c: 'Hydrophilic'},
                    {t: 'option', p: {key: 'material-hydrophobic', value: 'hydrophobic'}, c: 'Hydrophobic'}
                ]},
                {t: 'select', p: {label: 'Pieces', name: 'pieces', key: 'select-pieces'}, c: [
                    {t: 'option', p: {key: 'pieces-1', value: '1', default: true}, c: '1-piece'},
                    {t: 'option', p: {key: 'pieces-3', value: '3'}, c: '3-piece'}
                ]},
                {t: 'select', p: {label: 'Edge', name: 'edge', key: 'select-edge'}, c: [
                    {t: 'option', p: {key: 'edge-rounded', value: 'rounded', default: true}, c: 'Rounded'},
                    {t: 'option', p: {key: 'edge-square', value: 'square'}, c: 'Square'}
                ]},
                {t: 'select', p: {label: 'Diopter', name: 'diopter', key: 'select-diopter'}, c: diopterOpts }
            ]
        }

        // [...Array(100).keys()].map(k)

        // t = type, p = props, c = children
        const elems = elemParamsA.map((elemParams, idx) => {
            const label = elemParams.p ? elemParams.p.label : ''
            const children = Array.isArray(elemParams.c) ? elemParams.c : [elemParams.c]
            return this.buildElement({t: 'div', p: {key: `IOL-${idx}`}},
                             this.buildElement({t: 'label', p: {key: `${elemParams.p.key}-label`}}, label),
                             this.buildElement({t: elemParams.t, p: elemParams.p}, ...children))
        })

        console.log("==== elems = ", elems)

        return e('div', null, elems)
    }
}

export default ProductProperties
// export default withStyles(s)(ProductProperties)
