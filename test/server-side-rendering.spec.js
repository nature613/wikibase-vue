const unexpected = require('unexpected');
const unexpectedDOM = require('unexpected-dom');
const expect = unexpected.clone().use(unexpectedDOM);
const fetch = require('isomorphic-fetch');

const createServer = require('../server.js');

describe('Vue SSR', () => {
    const port = 3001;
    const server = createServer();
    server.listen(3001);

    it('returns 200 with HTML on POST /lemma-widget', async () => {
        const response = await fetch(`http://localhost:${port}/lemma-widget`, {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify({})
        });

        const body = await response.text();

        expect(response.status, 'to be', 200);
        expect(
            body,
            'parsed as html', 'queried for first', 'div',
            'to have attribute', {'data-server-rendered': true}
        );
    })
});
