import Ember from 'ember';

function debouncedSetter(key){
  const set = function(value){
      this.set(key, value);
  };

  return Ember.computed(key, {
    get(){
      return this.get(key);
    },
    set(key, value){
      Ember.run.debounce(this, set, value, 500);
      return value;
    }
  });
}

export default Ember.Controller.extend({
  debouncedLang: debouncedSetter("lang"),
  debouncedPlaceholder: debouncedSetter("placeholder"),

  resetCss: true,
  semantic: false,

  btns: [
    ['viewHTML'],
    ['undo', 'redo'],
    ['formatting'],
    'btnGrp-design',
    ['link'],
    ['image'],
    'btnGrp-justify',
    'btnGrp-lists',
    ['foreColor', 'backColor'],
    ['preformatted'],
    ['horizontalRule'],
    ['fullscreen']
  ]
});