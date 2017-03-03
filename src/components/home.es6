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
                    For 30 years our team has been dramatically lowering costs by building open, fair markets for only the highest quality products.
                </div>
            </section>
        );
        sections.push(
            <section key='step1' className='steps'>
                <div className='col-left'>
                    <div className='section-head'>
                        1.&nbsp;&nbsp;Buyers choose products
                    </div>
                    <div className='section-body'>
                        Select product specifications by browsing our extensive offering of consumable goods.
                    </div>
                    {/* -- 1. Buyers specify the types of products they need --*/}
                </div>
                <div className='col-right'>
                    <img src='/assets/images/Logomakr_5s5LLD.png' style={{height: '4em'}}/>
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
                        2.&nbsp;&nbsp;We aggregate demand across buyers
                    </div>
                    <div className='section-body'>
                        For each product specification we combine requests across buyers to build significant volume.
                    </div>
                </div>
                <div className='col-left'>
                    <img src='/assets/images/Logomakr_4KHtfP.png' style={{height: '6em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='clear-step2' className='clear-float'>
            </section>
            );
        sections.push(
            <section key='step3' className='steps'>
                <div className='col-left'>
                    <div className='section-head'>
                        3.&nbsp;&nbsp;Sellers bid
                    </div>
                    <div className='section-body'>
                        We bring together suppliers from around the world with regulatory approval.  Bids include freight and other costs.
                    </div>
                </div>
                <div className='col-right'>
                    <img src='/assets/images/Logomakr_5C1XRM.png' style={{height: '4em'}}/>
                </div>
            </section>
            );
        sections.push(
            <section key='clear-step3' className='clear-float'>
            </section>
            );
        sections.push(
            <section key='step4' className='steps'>
                <div className='col-right'>
                    <div className='section-head'>
                        4.&nbsp;&nbsp;Buyers choose the best bid
                    </div>
                    <div className='section-body'>
                        The order is completed through the buyer's existing procurement system.
                    </div>
                </div>
                <div className='col-left'>
                    <img src='/assets/images/cart_42n8Kh.png' style={{height: '4em'}}/>
                </div>
            </section>
        );
        sections.push(
            <section key='clear-step4' className='clear-float'>
            </section>
        );

        home =
            <div>
                <div id='background'>
                </div>
                <div className='main'>
                    <div className='intro'>{ sections }</div>
                </div>
            </div>

        // console.log("==== home = ", home);
        return home
    }
}

export default connect()(Home)