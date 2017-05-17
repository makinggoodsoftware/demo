import React from 'react'
// import Select from 'react-select'
// import s from 'react-select/dist/react-select.css'
// import withStyles from 'isomorphic-style-loader/lib/withStyles'

class ProductProperties extends React.Component {

    constructor(props) {
        super(props)
        this.initCommodityState(props, true)
    }

    initCommodityState(props, constructor) {
        this.setCommodityState(props, props.commodityPropRules.defaults, constructor)
    }

    changeEvtHandler(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        // console.log(`==== setting commodity Property ${name} to ${value}`)
        const commProps = this.state.commodityProps
        commProps[name] = value
        this.setCommodityState(this.props, commProps)
    }

    setCommodityState(props, commProps, constructor) {
        const commName = props.commodityName
        if (constructor) {
            this.state = { commodityProps: commProps}
        } else {
            this.setState({commodityProps: commProps})
        }
        this.commDescription = this.buildDescription(props, commProps)
        console.log("==== just built description: ", this.commDescription)
        if (!constructor) {
            this.props.parentEvtHandler(commProps, this.commDescription)
        } else {
            this.commProps = commProps   // componentDidMount will call parentEvtHandler, this seems kinda hacky
        }
    }

    buildDescription(props, commProps) {
        if (props.commodityPropRules.descriptionFn) {
            return props.commodityPropRules.descriptionFn(props.commodityName, commProps)
        } else {
            return this.buildGenericDescription(props, commProps)
        }
    }

    buildGenericDescription(props, commProps) {
        const descriptions = props.commodityPropRules.elements.map(elemName => {
            if (commProps[elemName]) {
                const describeFn = this.sharedPropertyElements(elemName).describeFn
                // console.log(`==== describeFn for ${elemName} =`, describeFn)
                return describeFn(commProps)
            } else {
                return null
            }
        })
        return ([props.commodityName].concat(descriptions)).filter(str => str).join(' / ')
    }

    buildElement(paramObj, displayFn, ...children) {  // recursively builds children of element
        const elemName = paramObj.e
        let props = paramObj.p
        // console.log(`==== buildElement received elemName '${elemName}', props: `, props)
        // console.log("==== buildElement received children ", children)
        if (elemName != 'option') {
            const value = this.state.commodityProps ? this.state.commodityProps[props.name] : undefined
            // console.log(`==== in buildElement state value of ${props.name} = `, value)
            props = Object.assign(props ? props : {}, {onChange: this.changeEvtHandler.bind(this), value: this.state.commodityProps[props.name]})
        } else if (props && props.value) {
            // console.log("==== displayFn = ", displayFn)
            children = [displayFn(props.value)]  // lookup display value
            // console.log("==== option children just set to ", children)
        }
        children = children.map(child => {
            if (typeof child !== 'object' || child === null || (child['$$typeof'] && child['$$typeof'].toString() == "Symbol(react.element)")) {  // hack to tell if child has already been built by React.createElement
                // child is string or an-already-constructed-ReactElement or ?
                // console.log("==== returning child: ", child)
                return child
            } else {   // another element needs building
                // console.log(`==== child is object, building element with element name ${child.e}, props: `, child.p)
                // console.log(`==== child is object, building element with grandchildren: `, child.c)
                const grandchildren = Array.isArray(child.c) ? child.c : [child.c]
                // console.log(`==== child is object, building elem with massaged grandchild: `, grandchildren)
                return this.buildElement({e: child.e, p: child.p}, displayFn, ...grandchildren)
            }
        })
        // console.log("==== built children = ", children)
        // passing undefined or null or array of same as a child of an input element causes React to choke
        children = children.filter(child => child) // removes null values
        const newElem = children.length == 0 ? React.createElement(elemName, props) : React.createElement(elemName, props, children)

        return newElem
    }

    // getIolPropRules() {
    //     const diopterOpts = []
    //     for (let i = -100; i <= 400; i = i + 5) {
    //         const valueStr = i == 0 ? '0' : (i > 0 ? `+${i / 10}` : i / 10)
    //         diopterOpts.push({e: 'option', p: {key: `diopter-${i}`, value: valueStr}, c: valueStr})
    //     }
    //
    //     const cylinderOpts = [{e: 'option', p: {key: `cylinder-0`, value: '0'}, c: '0'}]
    //     for (let i = 15; i <= 60; i = i + 5) {
    //         const valueStr = i == 0 ? '0' : (i > 0 ? `+${i / 10}` : i / 10)
    //         cylinderOpts.push({e: 'option', p: {key: `cylinder-${i}`, value: valueStr}, c: valueStr})
    //     }
    //
    //     // return new class PropertyRules {
    //     const propRules =  {
    //         displayFn(key) {
    //             const displayValues = {
    //                 mono: 'Monofocal', bi: 'Bifocal', multi: 'Multifocal', pmma: 'PMMA',
    //                 hydrophilic: 'Hydrophilic', hydrophobic: 'Hydrophobic', 1: '1-piece', 3: '3-piece',
    //                 round: 'Round', square: 'Square', true: 'Yes', false: 'No', zero: 'Zero', negative: 'Negative',
    //                 transparent: 'Transparent', yellow: 'Yellow'
    //             }
    //             return displayValues[key] || key
    //         },
    //
    //         elements: [
    //             {e: 'select', p: {label: 'Optics', name: 'optics', key: 'select-optic'}, c: [
    //                     {e: 'option',  p: {key: 'optic-null'} },
    //                     {e: 'option', p: {key: 'optic-mono', value: 'mono'} },
    //                     {e: 'option', p: {key: 'optic-bi', value: 'bi'} },
    //                     {e: 'option', p: {key: 'optic-multi', value: 'multi'} }]},
    //             {e: 'select', p: {label: 'Material', name: 'material', key: 'select-material'}, c: [
    //                     {e: 'option',  p: {key: 'material-null'} },
    //                     {e: 'option', p: {key: 'material-pmma', value: 'pmma', default: true} },
    //                     {e: 'option', p: {key: 'material-hydrophilic', value: 'hydrophilic'} },
    //                     {e: 'option', p: {key: 'material-hydrophobic', value: 'hydrophobic'} }]},
    //             {e: 'select', p: {label: 'Pieces', name: 'pieces', key: 'select-pieces'}, c: [
    //                     {e: 'option',  p: {key: 'pieces-null'} },
    //                     {e: 'option', p: {key: 'pieces-1', value: '1', default: true} },
    //                     {e: 'option', p: {key: 'pieces-3', value: '3'} }]},
    //             {e: 'select', p: {label: 'Edge', name: 'edge', key: 'select-edge'}, c: [
    //                     {e: 'option', p: {key: 'edge-round', value: 'round', default: true} },
    //                     {e: 'option', p: {key: 'edge-square', value: 'square'} }]},
    //
    //             {e: 'select', p: {label: 'Diopter', name: 'diopter', key: 'select-diopter'}, c: diopterOpts},
    //
    //             {e: 'span', p: {label: 'Optic Diameter ⌀', key: 'span-optic-dia'}, c: [{e: 'input',
    //                 p: {name: 'opticDiameter', type: 'text', key: 'input-optic-dia', size: 3} }, ' mm']},
    //
    //             {e: 'span', p: {label: 'Overall Diameter ⌀', key: 'span-overall-dia'}, c: [{e: 'input',
    //                 p: {name: 'overallDiameter', type: 'text', key: 'input-overall-dia', size: 4} }, ' mm']},
    //
    //             {e: 'select', p: {label: 'Aspheric', name: 'aspheric', key: 'select-aspheric'}, c: [
    //                 {e: 'option', p: {key: 'aspheric-false', value: 'false'} },
    //                 {e: 'option', p: {key: 'aspheric-zero', value: 'zero'} },
    //                 {e: 'option', p: {key: 'aspheric-negative', value: 'negative'} }]},
    //
    //             {e: 'select', p: {label: 'Chromophore', name: 'chromophore', key: 'select-chromophore'}, c: [
    //                 {e: 'option', p: {key: 'chromophore-transparent', value: 'transparent'} },
    //                 {e: 'option', p: {key: 'chromophore-yellow', value: 'yellow'} }]},
    //
    //             {e: 'select', p: {label: 'Cylinder', name: 'cylinder', key: 'select-cylinder'}, c: cylinderOpts},
    //
    //             {e: 'select', p: {label: 'Scleral fixation', name: 'scleral', key: 'select-scleral'}, c: [
    //                 {e: 'option', p: {key: 'scleral-false', value: 'false'} },
    //                 {e: 'option', p: {key: 'scleral-true', value: 'true'} }]},
    //
    //             {e: 'select', p: {label: 'Pediatric', name: 'pediatric', key: 'select-pediatric'}, c: [
    //                 {e: 'option', p: {key: 'pediatric-false', value: 'false'} },
    //                 {e: 'option', p: {key: 'pediatric-true', value: 'true'} }]}
    //         ],
    //
    //         defaults: {
    //             diopter: '0', opticDiameter: '6', overallDiameter: '12', aspheric: 'false', chromophore: 'transparent', cylinder: '0',
    //             scleral: 'false', pediatric: 'false'
    //         },
    //
    //         descriptionFn(commodityProps) {
    //             const edge = commodityProps.edge == 'square' ? 'square' : ''
    //             const aspheric = commodityProps.aspheric && commodityProps.aspheric != 'false' ? `Aspheric ${commodityProps.aspheric}` : ''
    //             const opticDiameter = commodityProps.opticDiameter && commodityProps.opticDiameter != '6' ? `Opt ⌀${commodityProps.opticDiameter} mm` : ''
    //             const overallDiameter = commodityProps.overallDiameter && commodityProps.overallDiameter != '12' ? `Overall ⌀${commodityProps.overallDiameter}mm` : ''
    //             const chromophore = commodityProps.chromophore && commodityProps.chromophore == 'yellow' ? 'Yellow' : ''
    //             const cylinder = commodityProps.cylinder && commodityProps.cylinder == '0' ? '' : `Cylinder ${commodityProps.cylinder}`
    //             const scleral = commodityProps.scleral && commodityProps.scleral == 'true' ? 'Scleral fixation' : ''
    //             const pediatric = commodityProps.pediatric && commodityProps.pediatric == 'true' ? 'Pediatric' : ''
    //             console.log("==== descriptionFn commodityProps = ", commodityProps)
    //             // console.log("==== propRules.displayFn = ", propRules.displayFn)
    //             return [commodityProps.commodityName,
    //                 propRules.displayFn(commodityProps.optics),
    //                 propRules.displayFn(commodityProps.material),
    //                 propRules.displayFn(commodityProps.pieces),
    //                 propRules.displayFn(edge),
    //                 propRules.displayFn(commodityProps.diopter),
    //                 propRules.displayFn(opticDiameter),
    //                 propRules.displayFn(overallDiameter),
    //                 propRules.displayFn(aspheric),
    //                 propRules.displayFn(chromophore),
    //                 propRules.displayFn(cylinder),
    //                 propRules.displayFn(scleral),
    //                 propRules.displayFn(pediatric)
    //             ].filter(str => str).join(' / ')
    //         }
    //
    //     }
    //     return propRules
    // }

    sharedPropertyElements(property) {
        const elems = {
            container: { elements: {
                e: 'select', p: {label: 'Container', name: 'container', key: 'select-container'}, c: [
                    {e: 'option', p: {key: 'container-any', value: 'any'} },
                    {e: 'option', p: {key: 'container-ampule', value: 'ampule'} },
                    {e: 'option', p: {key: 'container-bottle', value: 'bottle'} },
                    {e: 'option', p: {key: 'container-tube', value: 'tube'} },
                    {e: 'option', p: {key: 'container-vial', value: 'vial'} }]},
                describeFn(commodityProps) {
                    return commodityProps.container ? `${commodityProps.container}` : '' } },
            solution: { elements: {
                e: 'span', p: {label: 'Solution', key: 'span-solution'}, c: [{
                    e: 'input',
                    p: {name: 'solution', type: 'text', key: 'input-solution', size: 3}
                }, ' %'] },
                describeFn(commodityProps) {
                    return commodityProps.solution ? `${commodityProps.solution}%` : '' } },
            volume: { elements: {
                e: 'span', p: {label: 'Volume', key: 'span-volume'}, c: [{
                    e: 'input',
                    p: {name: 'volume', type: 'text', key: 'input-volume', size: 5}
                }, ' ml'] },
                describeFn(commodityProps) {
                    return commodityProps.volume ? `${commodityProps.volume}ml` : '' } },
            weight: { elements: {
                e: 'span', p: {label: 'Weight', key: 'span-weight'}, c: [{
                    e: 'input',
                    p: {name: 'weight', type: 'text', key: 'input-weight', size: 5}
                }, ' mg'] },
                describeFn(commodityProps) {
                    return commodityProps.weight ? `${commodityProps.weight}mg` : '' } }
        }
        return elems[property]
    }

    buildElems(propertyRules) {
        if (!propertyRules.displayFn) {  // needed for sharedPropertyElements
            propertyRules.displayFn = (key) => {
                const displayValues = {
                    true: 'Yes', false: 'No', any: 'Any', tube: 'Tube', bottle: 'Bottle', vial: 'Vial',
                    ampule: 'Ampule'
                }
                return displayValues[key] || key
            }
        }

        return propertyRules.elements.map((elemParams, idx) => {
            if (typeof elemParams == 'string') {  // element is common & shared, lookup the details
                elemParams = this.sharedPropertyElements(elemParams).elements
                // this.commodityPropertyRules.describeFns[elemName] = elemParams.describeFn
            }
            const label = elemParams.p ? elemParams.p.label : ''
            const children = Array.isArray(elemParams.c) ? elemParams.c : [elemParams.c]
            return this.buildElement({e: 'div', p: {key: `commodity-${idx}`}}, null,
                this.buildElement({e: 'span', p: {className: 'required-symbol', key: `${elemParams.p.key}-req`}}, null, '*'),
                this.buildElement({e: 'label', p: {key: `${elemParams.p.key}-label`}}, null, label),
                this.buildElement({e: elemParams.e, p: elemParams.p}, propertyRules.displayFn, ...children))
        })
    }

    componentWillReceiveProps(nextProps) {
        // needed for resetting default values
        console.log("==== cWRP in productProperties ")
        if (this.props.commodityId != nextProps.commodityId) {
            console.log(`==== about to change to commodityName ${nextProps.commodityName}, id =`, nextProps.commodityId)
            this.initCommodityState(nextProps)
        }
    }

    componentDidMount() {
        this.props.parentEvtHandler(this.commProps, this.commDescription)
    }

    render() {
        console.log(`==== rendering productProperties for ${this.props.commodityId}: `, this.props.commodityName)
        console.log("==== commPropRules = ", this.props.commodityPropRules)
        let elems
        if (this.props.commodityPropRules.elements.length == 0) {
            elems = "We're still working on setting up the details necessary to correctly specify this product.  We welcome your input into the details you would like to see here."
        } else {
            this.commodityElems = this.buildElems(this.props.commodityPropRules)
            elems = this.commodityElems
        }

        console.log("==== elems = ", elems)

        return React.createElement('div', null, elems)
    }
}

export default ProductProperties
// export default withStyles(s)(ProductProperties)
