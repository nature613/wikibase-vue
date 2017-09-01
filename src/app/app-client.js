import createApp from './app.js';
import Lemma from './datamodel/Lemma.js';

const initialState = window.__INITIAL_STATE__;

const render = () => {
    const app = createApp(initialState);
    app.$mount('#app');
}

if (module.hot) {
    module.hot.accept('./app.js', () => {
        console.log('Re-rendering application.');
        render();
    });
}

render();
