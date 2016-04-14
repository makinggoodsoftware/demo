var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/build');
var SRC_DIR = path.resolve(__dirname, 'src/client');

var config = {
    entry: SRC_DIR + '/index.es6',
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
            }
        ]
    }
};

module.exports = config;