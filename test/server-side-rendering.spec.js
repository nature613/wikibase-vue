const unexpected = require('unexpected');
const unexpectedDOM = require('unexpected-dom');
const expect = unexpected.clone().use(unexpectedDOM);
const fetch = require('isomorphic-fetch');

describe('Vue SSR', () => {
    it('returns 200 with HTML on POST /lemma-widget', async () => {
        const response = await fetch('http://localhost:3000/lemma-widget', {
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
