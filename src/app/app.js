import Vue from 'vue/dist/vue.common.js';
import createStore from './store.js';

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

const LemmaWidget = new Vue(require('./widgets/LemmaWidget.newLemmaWidget')(
  createStore()
))

export default function() {
  return LemmaWidget
}
