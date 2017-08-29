const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const path = require('path');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    entry: './src/app/app.js',
    target: 'web',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new VueSSRClientPlugin()
    ]
});
