import createApp from './app.js';
import Lemma from './datamodel/Lemma.js';

const initialState = window.__INITIAL_STATE__;
const app = createApp(initialState);
app.$mount('#app');
