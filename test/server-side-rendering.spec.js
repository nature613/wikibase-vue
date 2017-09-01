const unexpected = require('unexpected');
const unexpectedDOM = require('unexpected-dom');
const expect = unexpected.clone().use(unexpectedDOM);
const fetch = require('isomorphic-fetch');
const {JSDOM} = require('jsdom');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const createServer = require('../src/server/server.js');
const webpackConfig = require('../webpack.config.js');
const {extractClientManifest, extractServerBundle} = require('../src/extract-webpack-stats');

describe('Vue SSR', () => {
    const port = 3001;

    beforeAll((done) => {
        const compiler = webpack(webpackConfig);
        const devMiddleware = webpackDevMiddleware(compiler);

        devMiddleware.waitUntilValid((result) => {
            const serverBundle = extractServerBundle(result);
            const clientManifest = extractClientManifest(result);
            const server = createServer(serverBundle, clientManifest, devMiddleware);
    server.listen(3001);
            done();
        });
    });

    it('returns 200 with HTML on POST /lemma-widget', async () => {
        const response = await requestWidget([]);

        const body = await response.text();

        expect(response.status, 'to be', 200);
    })

    const buildLemmasPayload = lemmas => {
        const requestLemmas = lemmas.reduce(( result, lemma ) => {
            result[lemma.language] = lemma;
            return result;
        }, {});

        return { lemmas: requestLemmas };
    };



    it('renders a lemma from the request payload', async () => {
        const response = await requestWidget(validData);
        const body = await response.text();

        expect(
            body,
            'parsed as html', 'queried for first', '.lemma-widget_lemma-value',
            'to have text', 'my value'
        );
    })

    it('renders on the server and then picks up on the client', async () => {
        const response = await requestWidget(validData);
        const document = createDOM(await response.text());

        expect(document, 'to have been rendered on the server');

        await delay(100);

        expect(document, 'to have been rendered on the client');

    })

    const validData = [{
        value: 'my value',
        language: 'en'
    }];


    const requestWidget = (lemmas) => fetch(
        `http://localhost:${port}/lemma-widget`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(buildLemmasPayload(lemmas))
        });

    const createDOM = body => {
        const {document} = new JSDOM(body, {
            url: `http://localhost:${port}`,
            runScripts: 'dangerously',
            resources: 'usable'
        }).window;
        return document;
    };

    expect.addAssertion('<HTMLDocument> to have been rendered on the server', function (expect, document)  {
        expect(
            document, 'queried for first', '#app',
            'to have attribute', {'data-server-rendered': true}
        );
    });
    expect.addAssertion('<HTMLDocument> to have been rendered on the client', function (expect, document)  {
        expect(
            document.body, 'queried for first', '#app',
            'to have attribute', {'data-server-rendered': undefined }
        );
    });
});

const delay = delay => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
};
