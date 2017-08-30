const template = `<div id="app" class="lemma-widget">
	<ul v-if="!inEditMode" class="lemma-widget_lemma-list">
		<li v-for="lemma in lemmas" class="lemma-widget_lemma">
			<span class="lemma-widget_lemma-value">{{lemma.value}}</span>
			<span class="lemma-widget_lemma-language">{{lemma.language}}</span>
		</li>
	</ul>
	<div v-else class="lemma-widget_edit-area">
		<ul class="lemma-widget_lemma-list">
			<li v-for="lemma in lemmas" class="lemma-widget_lemma-edit-box">
				<span class="lemma-widget_lemma-value-label">
					{{'wikibase-lemma-field-lemma-label'|message}}
				</span>
				<input size="1" class="lemma-widget_lemma-value-input" 
					v-model="lemma.value" :disabled="isSaving">
				<span class="lemma-widget_lemma-language-label">
					{{'wikibase-lemma-field-language-label'|message}}
				</span>
				<input size="1" class="lemma-widget_lemma-language-input" 
					v-model="lemma.language" :disabled="isSaving">
				<button class="lemma-widget_lemma-remove" v-on:click="remove(lemma)" 
					:disabled="isSaving" :title="'wikibase-remove'|message">
					&times;
				</button>
			</li>
			<li>
				<button type="button" class="lemma-widget_add" v-on:click="add" 
					:disabled="isSaving" :title="'wikibase-add'|message">+</button>
			</li>
		</ul>
	</div>
	<div class="lemma-widget_controls" v-if="isInitialized" >
		<button type="button" class="lemma-widget_edit" v-if="!inEditMode" 
			:disabled="isSaving" v-on:click="edit">{{'wikibase-edit'|message}}</button>
		<button type="button" class="lemma-widget_save" v-if="inEditMode" 
			:disabled="isSaving" v-on:click="save">{{'wikibase-save'|message}}</button>
		<button type="button" class="lemma-widget_cancel" v-if="inEditMode" 
			:disabled="isSaving"  v-on:click="cancel">{{'wikibase-cancel'|message}}</button>
	</div>
</div>`;

import Lemma from "../datamodel/Lemma.js";

export default ( function ( mw ) {
	'use strict';

	function copyLemmaList( list ) {
		var result = [];
		list.forEach( function ( lemma ) {
			result.push( lemma.copy() );
		} );

		return result;
	}

	return function ( ) {
		return {
			template: template,
			data() {
          return {
              isInitialized: true,
              inEditMode: false,
              lemmas: copyLemmaList( this.$store.state.lemmas )
          }
      },
			computed: {
				isSaving: function () {
					return this.$store.state.isSaving;
				}
			},
			methods: {
				edit: function () {
					this.inEditMode = true;
				},
				add: function () {
					this.lemmas.push( new Lemma( '', '' ) );
				},
				remove: function ( lemma ) {
					var index = this.lemmas.indexOf( lemma );
					this.lemmas.splice( index, 1 );
				},
				save: function () {
					return this.$store.dispatch( 'save', this.lemmas ).then( function () {
						this.inEditMode = false;
					}.bind( this ) );
				},
				cancel: function () {
					this.inEditMode = false;
					this.lemmas = copyLemmaList( this.$store.state.lemmas );
				}
			},
			filters: {
				message: function ( key ) {
					return mw.messages.get( key );
				}
			}
		};
	};
} )( mediaWiki );
