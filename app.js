import Vue from 'vue/dist/vue.common.js';
import Vuex from 'vuex';

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

var newLemmaWidgetStore = require( './src/widgets/LemmaWidget.newLemmaWidgetStore' );
Vue.use(Vuex)

var store = new Vuex.Store( newLemmaWidgetStore( null, [], '', '' ) );
const LemmaWidget = new Vue(require('./src/widgets/LemmaWidget.newLemmaWidget')(
  store,
  '#lemmas-widget',
  '<div>{{hi}}</div>"'
))

export default function() {
  return LemmaWidget
}
