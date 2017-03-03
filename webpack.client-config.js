var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build/public/assets');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
    target: 'web',
    entry: SRC_DIR + '/client/index.es6',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        rules : [
            {
                test : /\.es6?/,
                include : SRC_DIR,
                loader : 'babel-loader'
            }
        ]
    }
};

module.exports = config;