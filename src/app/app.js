import Vue from 'vue/dist/vue.common.js';

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

export default function(store) {
    const newLemmaWidget = require('./widgets/LemmaWidget.newLemmaWidget.js');
    return new Vue(newLemmaWidget(store));
}
