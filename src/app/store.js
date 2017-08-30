import Vuex from 'vuex';
import newLemmaWidgetStore from './widgets/LemmaWidget.newLemmaWidgetStore';

export default (lemmas) => {
    return new Vuex.Store( newLemmaWidgetStore( null, lemmas, '', '' ) );
}
