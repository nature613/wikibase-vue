const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/app/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./build/'),
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  plugins: [
    new VueSSRServerPlugin()
  ]
};
