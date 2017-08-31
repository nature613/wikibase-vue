const unexpected = require('unexpected');
const unexpectedDOM = require('unexpected-dom');
const expect = unexpected.clone().use(unexpectedDOM);
const fetch = require('isomorphic-fetch');
const {JSDOM} = require('jsdom');

const createServer = require('../src/server/server.js');

describe('Vue SSR', () => {
    const port = 3001;
    const server = createServer();
    server.listen(3001);

    it('returns 200 with HTML on POST /lemma-widget', async () => {
        const response = await requestWidget([]);

        const body = await response.text();

        expect(response.status, 'to be', 200);
    })

    const buildLemmasPayload = lemmas => {
        return lemmas.reduce(( result, lemma ) => {
            result[lemma.language] = lemma;
            return result;
        }, {});
    };



    it('renders a lemma from the request payload', async () => {
        const response = await requestWidget([{value: 'my value', language: 'foo'}]);
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
