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

module.exports = {extractClientManifest, extractServerBundle};
