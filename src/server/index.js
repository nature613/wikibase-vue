const process = require('process')
const path = require('path')
const http = require('http');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../webpack.config.js');
const {extractClientManifest, extractServerBundle} = require('../extract-webpack-stats');

const main = () => {
    let currentExpressApp;
    let currentServerBundle;
    let currentClientManifest;

    console.log('ppath', webpackConfig[1].output.publicPath);
    const httpServer = http.createServer();
    const compiler = webpack(webpackConfig);
    const devMiddleware = webpackDevMiddleware(compiler, {
        noInfo: true
    });
    const hotMiddleware = webpackHotMiddleware(compiler);

    const replaceServer =  () => {
        currentExpressApp = replaceExpressApp(
            httpServer,
            currentExpressApp,
            [devMiddleware, hotMiddleware],
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
        module.hot.accept();
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
main();

