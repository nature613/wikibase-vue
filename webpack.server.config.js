const webpack = require('webpack');
const path = require('path');
const StartServerPlugin = require("start-server-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

const poll = 'webpack/hot/poll?1000';

module.exports = {
    entry: [ poll, './src/server/index' ],
    output: {
        path: path.resolve('./build/'),
        filename: 'server.js'
    },
    target: 'node',
    watch: true,
    externals: [ nodeExternals({whitelist: [poll]}) ],
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new StartServerPlugin({
            name: 'server.js',
            nodeArgs: ['--inspect']
        })
    ]
}
