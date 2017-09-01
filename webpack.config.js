const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const baseConfig ={
    entry: [ './src/app/globals.js' ],
    output: {
        filename: '[name].js',
        path: path.resolve('./build/'),
    }
};

const clientConfig = merge(baseConfig, {
    name: 'clientApp',
    entry:[ 'webpack-hot-middleware/client', './src/app/app-client.js' ],
    target: 'web',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new VueSSRClientPlugin()
    ]
});

const serverConfig = merge(baseConfig, {
    name: 'serverApp',
    entry: [ './src/app/app-server.js' ],
    target: 'node',
    devtool: 'source-map',
    output: {
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals(),
    plugins: [
        new VueSSRServerPlugin()
    ]
});

module.exports = [clientConfig, serverConfig];
