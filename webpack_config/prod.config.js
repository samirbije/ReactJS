var webpack = require("webpack");

const webpackMerge = require('webpack-merge');

const commonConfig = require('./base.config.js');

var CompressionPlugin = require('compression-webpack-plugin');

module.exports = function(env) {
    return webpackMerge(commonConfig, {
        plugins: [
                new webpack.DefinePlugin({ //<--key to reduce React's size
                    'process.env': {
                        'NODE_ENV': JSON.stringify('production')
                    }
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.AggressiveMergingPlugin(),
                new CompressionPlugin({
                    asset: "[path].gz[query]",
                    algorithm: "gzip",
                    test: /\.js$|\.css$|\.html$/,
                    threshold: 10240,
                    minRatio: 0.8
                })
            ]

    })
};

