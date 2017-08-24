const process = require('process')
const path = require('path')
const server = require('./server');

process.on('unhandledRejection', function (reason, promise) {
    console.log(reason, promise)
})

server.listen(3000, "0.0.0.0")
