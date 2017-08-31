const Vuex  = require('vuex');
const newLemmaWidgetStore = require( './widgets/LemmaWidget.newLemmaWidgetStore');

module.exports = (lemmas) => {
    return new Vuex.Store( newLemmaWidgetStore( null, lemmas, '', '' ) );
}
