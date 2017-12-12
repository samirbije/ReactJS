const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./base.config.js');

module.exports = function(env) {
    return webpackMerge(commonConfig, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({minimize: true})
        ]
    })
};
