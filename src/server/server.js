const path = require('path');
const express = require('express')

const Vue = require('vue/dist/vue.common.js');
const Vuex = require('vuex');
const { createBundleRenderer } = require('vue-server-renderer')

const clientManifest = require(path.resolve('./build/vue-ssr-client-manifest.json'));
const serverBundle = require(path.resolve('./build/vue-ssr-server-bundle.json'));


module.exports = () => {
  const app = express();

  const renderer = createBundleRenderer(serverBundle, {
      runInNewContext: true,
      clientManifest
  })

  var bodyParser = require('body-parser')
  app.use( bodyParser.json() );

  app.post('/', function (req, res) {
      console.log(req.body)

      const component = new Vue({
          data: req.body.data,
          template: req.body.template
      })

      renderer.renderToString(component, (err, html) => {
          if (err) throw err
          res.send(html)
      })
  })

  app.post('/lemma-widget', function (req, res) {
      renderer.renderToString((err, html) => {
          if (err) throw err
          res.send(html)
      })
  })

  return app;
}
