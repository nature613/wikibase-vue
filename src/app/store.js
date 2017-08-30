import Vuex from 'vuex';

const newLemmaWidgetStore = require( './widgets/LemmaWidget.newLemmaWidgetStore' );

export default (lemmas) => {
    return new Vuex.Store( newLemmaWidgetStore( null, lemmas, '', '' ) );
}
