const process = require('process')
const path = require('path')
const http = require('http');

const replaceExpressApp = () => {
    const clientManifest = require(  '../../build/vue-ssr-client-manifest.json' );
    const serverBundle = require('../../build/vue-ssr-server-bundle.json');

    currentExpressApp && httpServer.removeListener('request', currentExpressApp);
    const newExpressApp = currentExpressApp = createExpressApp(serverBundle, clientManifest);
    httpServer.on('request', newExpressApp);
}

const createExpressApp = (serverBundle, clientManifest) => {
    const createServer = require('./server');
    return createServer(serverBundle, clientManifest);
}

process.on('unhandledRejection', function (reason, promise) {
    console.log(reason, promise)
})

let currentExpressApp;

const httpServer = http.createServer();
httpServer.listen(3000, "0.0.0.0")
replaceExpressApp();
console.log('Server started.');

const replaceServerOnServerChange = () => {
    if(module.hot) {
        console.log('Hot Module Reloading activated.');
	      module.hot.accept("./server.js", function() {
            console.log('Hot-reloading server due to server change');
            replaceExpressApp();
	      });
        module.hot.accept('../../build/vue-ssr-server-bundle.json', function () {
            console.log('Hot-reloading server due to application bundle change');
            replaceExpressApp();
        })
    }
}

const replaceServerOnAppServerBundleChange = () => {
    const webpack = require('webpack');
    const webpackConfig = require('../../webpack.config.js');
    const compiler = webpack(webpackConfig);
    compiler.watch({}, () => {});
}

const main = () => {
    replaceServerOnAppServerBundleChange();
    replaceServerOnServerChange();
}

main();

