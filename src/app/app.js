import Vue from 'vue/dist/vue.common.js';
import Vuex from 'vuex';
import createStore from './store.js';
import Lemma from './datamodel/Lemma.js';
import newLemmaWidget from './widgets/LemmaWidget.newLemmaWidget.js';

Vue.use(Vuex);

export default function(state) {
    const lemmas = state.lemmas.map(lemma => new Lemma(lemma.value, lemma.language));
    const store = createStore(lemmas);
    return new Vue(Object.assign({store:store}, newLemmaWidget()));
}
