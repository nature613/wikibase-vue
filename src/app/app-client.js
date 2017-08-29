import createApp from './app.js';
import createStore from './store.js';
import Lemma from './datamodel/Lemma.js';

const initialState = window.__INITIAL_STATE__;
const lemmas = initialState.lemmas.map(lemma => new Lemma(lemma.value, lemma.language));
const store = createStore(lemmas);
const app = createApp(store);
app.$mount('#app');
