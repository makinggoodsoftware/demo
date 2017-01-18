// React-Treebeard uses Radium and React's built-in support for passing a style prop that React will turn into an online style 

'use strict';

export default {
    // the tree property & value were taken from node_modules/react-treebeard/lib/themes/default.js
    // and modified
    tree: {
        base: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            color: '#9DA5AB',
            fontFamily: 'Titillium Web, lucida grande, sans-serif',
            fontSize: '16px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#89ABE8'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: 'black'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    },
    component: {
        fontFamily: 'Titillium Web, lucida grande, sans-serif',
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '20px',
        '@media (max-width: 640px)': {
            width: '100%',
            display: 'block'
        }
    },
    searchBox: {
        padding: '20px 20px 0 20px'
    },
    viewer: {
        base: {
            fontFamily: 'Titillium Web, lucida grande, sans-serif',
            fontSize: '16px',
            whiteSpace: 'pre-wrap',
            border: 'solid 1px black',
            padding: '20px',
            color: 'black',
            // minHeight: '250px'
        }
    }
};
