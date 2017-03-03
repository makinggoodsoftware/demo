var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

var BUILD_DIR = path.resolve(__dirname, 'build');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
    target: 'node',
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    entry: SRC_DIR + '/server.js',
    output: {
        path: BUILD_DIR,
        filename: 'server.js'
    },
    module : {
        rules : [
            {
                test : /\.es6|\.jsx?$/,
                loader : 'babel-loader'
            }
        ]
    }
};

module.exports = config;