import createApp from './app.js';
import Lemma from './datamodel/Lemma.js';

export default (context) => {
    return createApp(context.state);
}
