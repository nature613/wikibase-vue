const path = require('path');
const express = require('express')

const Vue = require('vue/dist/vue.common.js');
const Vuex = require('vuex');
const { createBundleRenderer } = require('vue-server-renderer')

const fs = require('fs');

module.exports = (serverBundle, clientManifest, middlewares) => {
  const app = express();

    if(clientManifest === undefined) throw new Error('Missing clientManifest');
    if(serverBundle === undefined) throw new Error('Missing serverBundle');
  const renderer = createBundleRenderer(serverBundle, {
      runInNewContext: 'once',
      clientManifest,
      template: `<!--vue-ssr-outlet-->`
  })

  var bodyParser = require('body-parser')
  app.use( bodyParser.json() );

  middlewares.forEach(middleware => {
    app.use(middleware);
  });

  app.get('/lemma-widget', (req, res) => {
    const context = {
        state: {
            lemmas: [{
                value: 'my value',
                language: 'en'
            }]
        }
    };
    renderer.renderToString(context, (err, html) => {
        if (err) throw err
        res.send(html)
    });
  });

  app.post('/lemma-widget', function (req, res) {
      const context = {
          state: {
              lemmas: req.body.lemmas && Object.values( req.body.lemmas ) || []
          }
      }

      renderer.renderToString(context, (err, html) => {
          if (err) throw err
          res.send(html)
      })
  })

  return app;
}
