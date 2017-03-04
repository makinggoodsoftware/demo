var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

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
            },
            {
                test: /\.css$/,
                // loader: 'css-loader/locals'  // skips emitting css: https://github.com/petehunt/node-jsx/issues/29
                loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
            },
            {
                test: /\.(jpg)$/,  // for now handles only the .jpg referenced in the css file
                // BADloader: 'file-loader?name=img/img-[hash:6].[ext]&outputPath=public/assets/'
                // loader: 'file-loader?publicPath=assets/&name=./public/assets/img/[name]-[hash:6].[ext]'
                // publicPath here affects only the jpg referenced in base.css
                // loader: 'file-loader?publicPath=.././&name=./public/assets/img/[name]-[hash:6].[ext]'
                loader: 'file-loader?outputPath=public/assets/&name=./img/[name]-[hash:6].[ext]'
            },
            {
                test: /\.(png|gif)$/,
                loader: 'file-loader?emitFile=false'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("public/assets/styles.css")
        // new ExtractTextPlugin("styles.css")
    ]
};

module.exports = config;