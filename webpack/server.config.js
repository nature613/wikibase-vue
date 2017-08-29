const merge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  entry: './src/app/app.js',
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
