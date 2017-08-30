const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const baseConfig ={
    output: {
        filename: '[name].js',
        path: path.resolve('./build/'),
    }
};

const clientConfig = merge(baseConfig, {
    entry: './src/app/app-client.js',
    target: 'web',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new VueSSRClientPlugin()
    ]
});

const serverConfig = merge(baseConfig, {
    entry: './src/app/app-server.js',
    target: 'node',
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals(),
    plugins: [
        new VueSSRServerPlugin()
    ]
});

module.exports = [clientConfig, serverConfig];
