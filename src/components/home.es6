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
            <section key='introImage'>
                <img src='/images/medicalScene.JPG' style={{opacity: 0.9}}/>
            </section>
        );
        sections.push(
            <section key='headline' className='oddRow'>
                <div>
                    Competitive bidding = lower cost consumables for healthcare providers
                </div>
                <div className='sectionHead'>
                    How does it work?
                </div>
            </section>
            );
        sections.push(
            <section key='step1' className='evenRow'>
                <div className='colLeft'>
                    <div className='sectionHead'>
                        1. Choose your products
                    </div>
                    <div className='sectionBody'>
                        Buyers select product specifications by browsing our extensive offering of consumable goods.
                    </div>
                    {/* -- 1. Buyers specify the types of products they need --*/}
                </div>
                <div className='colRight'>
                    <img src='/images/products_88x9LV.png' style={{height: '4em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='step2' className='evenRow'>
                <div className='colRight'>
                    <div className='sectionHead'>
                        2. We combine your selections with other buyers
                    </div>
                    <div className='sectionBody'>
                        We aggregate the demand for each product specification across multiple buyers to achieve volume
                    </div>
                </div>
                <div className='colLeft'>
                    <img src='/images/products_88x9LV.png' style={{height: '4em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='clearFloat' className='clearFloat'>
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