const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  plugins: [
    new VueSSRServerPlugin()
  ]
};
