import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Home extends React.Component {
    constructor() {
        super();
    }

    render () {
        // console.log("==== props for home = ", this.props);
        let home;
        let sections = [];
        sections.push(
            <section key='headline'>
                <div className='headline'>
                    The medical product marketplace for competitive pricing
                </div>
                <div className='body'>
                    Our team has 30 years of experience lowering costs by building open, fair markets for only the highest quality products.
                </div>
                <div id='how-work' className='headline'>
                    How does it work?
                </div>
            </section>
        );
        sections.push(
            <section key='step1' className='steps'>
                <div className='col-left'>
                    <div className='section-head'>
                        1. Choose your products
                    </div>
                    <div className='section-body'>
                        Buyers select product specifications by browsing our extensive offering of consumable goods.
                    </div>
                    {/* -- 1. Buyers specify the types of products they need --*/}
                </div>
                <div className='col-right'>
                    <img src='/images/products_88x9LV.png' style={{height: '4em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='clear-step1' className='clear-float'>
            </section>
        );
        sections.push(
            <section key='step2' className='steps'>
                <div className='col-right'>
                    <div className='section-head'>
                        2. We combine your selections with other buyers
                    </div>
                    <div className='section-body'>
                        We aggregate the demand for each product specification across multiple buyers to achieve volume
                    </div>
                </div>
                <div className='col-left'>
                    <img src='/images/products_88x9LV.png' style={{height: '4em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='clear-step2' className='clear-float'>
            </section>
            );
        home =
            <div className='main'>
                <div className='intro'>{ sections }</div>
            </div>;

        // console.log("==== home = ", home);
        return home
    }
}

export default connect()(Home)