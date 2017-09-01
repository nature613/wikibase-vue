const process = require('process')
const path = require('path')
const http = require('http');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('../../webpack.config.js');

const main = () => {
    let currentExpressApp;
    let currentServerBundle;
    let currentClientManifest;

    const httpServer = http.createServer();
    const compiler = webpack(webpackConfig);
    const devMiddleware = webpackDevMiddleware(compiler);

    const replaceServer =  () => {
        currentExpressApp = replaceExpressApp(
            httpServer,
            currentExpressApp,
            devMiddleware,
            currentServerBundle,
            currentClientManifest
        );
    }

    compiler.plugin('done', (result) => {
        console.log('Hot-reloading server due to application bundle change.');
        currentClientManifest = extractClientManifest(result);
        currentServerBundle = extractServerBundle(result);
        replaceServer();
    });

    if(module.hot) {
        console.log('Hot Module Reloading activated.');
        module.hot.accept("./server.js", () => {
            console.log('Hot-reloading server due to server change');
            replaceServer();
        });
    }

    process.on('unhandledRejection', function (reason, promise) {
        console.log(reason, promise)
    });

    httpServer.listen(3000, "0.0.0.0")
    console.log('Server started.');
};

const replaceExpressApp = (httpServer, oldExpressApp, devMiddleware, serverBundle, clientManifest) => {
    const createServer = require('./server');

    if(serverBundle === undefined || clientManifest === undefined) {
        throw new Error('need bundles');
    }
    const newExpressApp = createServer(serverBundle, clientManifest, devMiddleware);

    oldExpressApp && httpServer.removeListener('request', oldExpressApp);

    httpServer.on('request', newExpressApp);
    return newExpressApp;
}

const extractClientManifest = result => JSON.parse(
    result
        .stats
        .find(x => x.compilation.name === 'clientApp')
        .compilation
        .assets['vue-ssr-client-manifest.json']
        .source()
);
const extractServerBundle = ( {stats} ) => JSON.parse(
    stats
        .find(x => x.compilation.name === 'serverApp')
        .compilation
        .assets['vue-ssr-server-bundle.json']
        .source()
);



main();

