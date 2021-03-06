import Ember from 'ember';
import layout from '../templates/components/trumbowyg-editor';

export default Ember.Component.extend({
  layout,
  tagName: 'textarea',
  html: null,
  placeholder: null,
  disabled: null,
  change: null,

  optionNames: [
    'prefix',
    'lang',
    'btns',
    'semantic',
    'resetCss',
    'removeformatPasted',
    'autogrow'
  ],
  
  oldOptions: {},

  _updateDisabled(){
    if (typeof this.get("disabled") === "boolean") {
      this.$().trumbowyg(this.get('disabled') ? 'disable' : 'enable');
    }
  },

  _renderTrumbowyg(){
    const options = this.get('optionNames')
      .filter(optionName => this.get(optionName) !== undefined )
      .reduce((options, optionName) => {
        options[optionName] = this.get(optionName);
        return options;
      }, {});
    options.svgPath = "/assets/ui/icons.svg";
    this.$().attr("placeholder", this.get("placeholder"));
    this.$().trumbowyg(options);
    this.$().trumbowyg('html', this.get('html'));
    this._updateDisabled();

    this.$().on('tbwchange', () => {
      if (this.get('change')) {
        this.get('change')(this.$().trumbowyg('html'));
      }
    });
  },

  _destroyTrumbowyg(){
    this.$().off('tbwchange');
    this.$().trumbowyg('destroy');
  },

  
  _isAttrChanged(attrName){
    return this.get(attrName) !== this.get(`oldOptions.${attrName}`);
  },

  didInsertElement(){
    this._renderTrumbowyg();
  },

  didReceiveAttrs() {
    var oldAttrs = this.get('oldOptions');
    this.get('optionNames').forEach((option) => {
      //oldAttrs[option] = this.get(option);
      Ember.set(oldAttrs, option, this.get(option));
    });
    Ember.set(oldAttrs, 'placeholder', this.get('placeholder'));
    Ember.set(oldAttrs, 'disabled', this.get('disabled'));
    this.set('oldOptions', oldAttrs);
  },

  didUpdateAttrs() {
    const optionsUpdated = this.get('optionNames')
      .some(optionName => this._isAttrChanged(optionName));
    const htmlUpdated = this.get('html') !== this.$().trumbowyg('html');
    const disabledUpdated = this._isAttrChanged('disabled');
    const placeholderUpdated = this._isAttrChanged('placeholder');

    if (htmlUpdated) {
      this.$().trumbowyg('html', this.get('html'));
    }

    if (optionsUpdated || placeholderUpdated) {
      this._destroyTrumbowyg();
      this._renderTrumbowyg();
    }
    

    if (disabledUpdated) {
      this._updateDisabled();
    }
  },

  willDestroyElement(){
    this._destroyTrumbowyg();
  }
});
