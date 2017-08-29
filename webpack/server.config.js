const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path');

const baseConfig = {
  output: {
    filename: 'bundle.js',
    path: path.resolve('./build/'),
  }
};

module.exports = merge(baseConfig, {
  entry: './src/app/app.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new VueSSRServerPlugin()
  ]
});
