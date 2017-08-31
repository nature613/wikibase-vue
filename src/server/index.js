const process = require('process')
const path = require('path')
const http = require('http');

const createExpressApp = () => {
    const createServer = require('./server');
    return createServer();
}

process.on('unhandledRejection', function (reason, promise) {
    console.log(reason, promise)
})


let currentExpressApp = createExpressApp();
const httpServer = http.createServer();

httpServer.on('request', currentExpressApp);
httpServer.listen(3000, "0.0.0.0")
console.log('Server started.');

if(module.hot) {
    console.log('Hot Module Reloading activated.');
	  module.hot.accept("./server.js", function() {
        console.log('Hot-reloading server');
        replaceExpressApp();
	  });
}

const replaceExpressApp = () => {
    httpServer.removeListener('request', currentExpressApp);
    const newExpressApp = currentExpressApp = createExpressApp();
    httpServer.on('request', newExpressApp);
}
