var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/build');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
    // target: 'node',  // used temporarily to verify it would build on server
    entry: SRC_DIR + '/client/index.es6',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.es6?/,
                include : SRC_DIR,
                loader : 'babel'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};

module.exports = config;