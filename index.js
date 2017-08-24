const express = require('express')
const Vue = require('vue/dist/vue.common.js');
const Vuex = require('vuex');
Vue.use(Vuex)
const app = express()
const process = require('process')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')

const renderer = createBundleRenderer(path.resolve('./build/vue-ssr-server-bundle.json'), {
  runInNewContext: true
})

global.mediaWiki = {
  messages: {
    get: function (id) {
      return id;
    }
  },

  config: {
    get: function (id) {
      return JSON.stringify({
        lemmas: []
      });
    }
  },
  Api: function () {}
}

global.wikibase = {
  api: {
    RepoApi: function () {

    }
  }
}

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

process.on('unhandledRejection', function (reason, promise) {
  console.log(reason, promise)
})

app.listen(3000, "0.0.0.0")
