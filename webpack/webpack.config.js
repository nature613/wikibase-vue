const webpack = require('webpack');
const clientConfig = require('./client.config.js');
const serverConfig = require('./server.config.js');

module.exports = [clientConfig, serverConfig];
