/**
 * @license GPL-2.0+
 */
describe( 'wikibase.lexeme.widgets.LemmaWidget', function () {
  require('jsdom-global')();
  global.mediaWiki = {};
	var sinon = require( 'sinon' );
	var expect = require( 'unexpected' ).clone();
	expect.installPlugin( require( 'unexpected-dom' ) );
	expect.installPlugin( require( 'unexpected-sinon' ) );

	var Vue = global.Vue = require( 'vue/dist/vue.common.js' );
	var Vuex = global.Vuex = require( 'vuex' );

  Vue.use(Vuex)

  require('../src/app/globals.js')

	var newLemmaWidget = require( '../src/app/widgets/LemmaWidget.newLemmaWidget.js');
	var newLemmaWidgetStore = require( '../src/app/store.js' );
	var Lemma = require( '../src/app/datamodel/Lemma.js' );

	it( 'initialize widget with one lemma', function () {
		var widget = newWidget( [ new Lemma( 'hello', 'en' ) ] );

		expect( widget.$el, 'to contain lemma', new Lemma( 'hello', 'en' ) );
	} );

	it( 'switches to edit mode', function ( done ) {
		var widget = newWidget( [ new Lemma( 'hello', 'en' ) ] );

		expect( widget, 'not to be in edit mode' );

		widget.edit();
		widget.$nextTick( function () {
			expect( widget, 'to be in edit mode' );
			done();
		} );
	} );

	it( 'cancel edit mode', function ( done ) {
		var widget = newWidget( [ new Lemma( 'hello', 'en' ) ] );

		widget.edit();
		widget.cancel();
		widget.$nextTick( function () {
			expect( widget, 'not to be in edit mode' );
			done();
		} );
	} );

	it( 'add a new lemma', function ( done ) {
		var widget = newWidget( [ new Lemma( 'hello', 'en' ) ] );

		expect( widget.$el, 'to contain lemma', new Lemma( 'hello', 'en' ) );
		widget.add();
		widget.$nextTick( function () {
			expect( widget.$el, 'to contain lemma', new Lemma( 'hello', 'en' ) );
			expect( widget.$el, 'to contain lemma', new Lemma( '', '' ) );
			done();
		} );
	} );

	it( 'remove a lemma', function ( done ) {
		var lemmaToRemove = new Lemma( 'hello', 'en' ),
			widget = newWidget( [ lemmaToRemove ] );

		expect( widget.$el, 'to contain lemma', new Lemma( 'hello', 'en' ) );
		widget.remove( lemmaToRemove );
		widget.$nextTick( function () {
			expect( widget.$el, 'to contain no lemmas' );
			done();
		} );
	} );

	it( 'save lemma list', function ( done ) {
		var lemmas = [ new Lemma( 'hello', 'en' ) ],
			store = newStore( lemmas ),
			widget = newWidgetWithStore( store ),
			storeSpy = sinon.stub( store, 'dispatch' ).callsFake( function () {
				return Promise.resolve();
			} );

		widget.edit();
		widget.save().then( function () {
			expect( storeSpy, 'to have a call satisfying', [ 'save', lemmas ] );
			expect( widget, 'not to be in edit mode' );
			done();
		} );
	} );

	function newWidget( initialLemmas ) {
		return newWidgetWithStore( newStore( initialLemmas ) );
	}

	function newStore( initialLemmas ) {
		return new Vuex.Store( newLemmaWidgetStore( initialLemmas ) );
	}

	function newWidgetWithStore( store ) {
		var element = document.createElement( 'div' );
      const vm = new Vue(Object.assign({store, el: element}, newLemmaWidget()));
      expect(vm.$el, 'to be defined');
      return vm;
	}

	var selector = {
		lemma: '.lemma-widget_lemma',
		lemmaValue: '.lemma-widget_lemma-value',
		lemmaLanguage: '.lemma-widget_lemma-language'
	};

	expect.addAssertion( '<DOMElement> to contain lemma <object>', function ( expect, element, lemma ) {
		var language = lemma.language;
		var value = lemma.value;
		expect.errorMode = 'nested';
		expect(
			element,
			'when queried for', selector.lemma + ' ' + selector.lemmaValue,
			'to have an item satisfying', 'to have text', value );
		expect(
			element,
			'when queried for', selector.lemma + ' ' + selector.lemmaLanguage,
			'to have an item satisfying', 'to have text', language );
	} );

	expect.addAssertion( '<DOMElement> to contain [no] lemmas', function ( expect, element ) {
		expect.errorMode = 'nested';
		expect( element, 'to contain [no] elements matching', selector.lemma );
	} );

	expect.addAssertion( '<object> [not] to be in edit mode', function ( expect, widget ) {
		expect.errorMode = 'nested';

		expect( widget.inEditMode, '[not] to be true' ); // TODO: why test internals?
		var no = expect.flags.not ? ' no ' : ' ';
		expect( widget.$el, 'to contain' + no + 'elements matching', 'input' );
	} );

} );
