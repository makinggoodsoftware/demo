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
            propertyRules.displayFn = (value) => {
                const displayValues = {
                    true: 'Yes', false: 'No', any: 'Any', tube: 'Tube', bottle: 'Bottle', vial: 'Vial',
                    ampule: 'Ampule'
                }
                return displayValues[value] || value
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
