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
        const response = await requestWidget({lemmas:[]});

        const body = await response.text();

        expect(response.status, 'to be', 200);
        expect(
            body,
            'parsed as html', 'queried for first', '#app',
            'to have attribute', {'data-server-rendered': true}
        );
    })

    it('renders a lemma from the request payload', async () => {
        const response = await requestWidget({
				    lemmas: [{
                value: 'my value',
                language: 'en'
            }]
        });
        const body = await response.text();

        expect(response.status, 'to be', 200);
        expect(
            body,
            'parsed as html', 'queried for first', '.lemma-widget_lemma-value',
            'to have text', 'my value'
        );
    })

    it('renders on the server and then picks up on the client', async () => {
        const response = await requestWidget({
				    lemmas: [{
                value: 'my value',
                language: 'en'
            }]
        });
        const body = await response.text();

        const {document} = new JSDOM(body, {
            url: `http://localhost:${port}`,
            runScripts: 'dangerously',
            resources: 'usable'
        }).window;

        expect(
            document.body,
            'queried for first', '#app',
            'to have attribute', {'data-server-rendered': true}
        );

        await delay(100);

        expect(
            document.body, 'queried for first', '#app',
            'to have attribute', {'data-server-rendered': undefined }
        );
    })

    const requestWidget = (body) => fetch(
        `http://localhost:${port}/lemma-widget`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

});

const delay = delay => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
};
