import createApp from './app.js';
import createStore from './store.js';
import Lemma from './datamodel/Lemma.js';


export default (context) => {
    const lemmas = context.state.lemmas.map(lemma => new Lemma(lemma.value, lemma.language));
    const store = createStore(lemmas);
    return createApp(store);
}
