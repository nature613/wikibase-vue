const express = require('express')
const Vue = require('vue')
const app = express()
const renderer = require('vue-server-renderer').createRenderer()

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



app.listen(3000, "0.0.0.0")
