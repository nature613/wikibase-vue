import Vue from 'vue';
import Vuex from 'vuex';

const newLemmaWidgetStore = require( './widgets/LemmaWidget.newLemmaWidgetStore' );

Vue.use(Vuex)

export default () => {
    return new Vuex.Store( newLemmaWidgetStore( null, [], '', '' ) );
}
