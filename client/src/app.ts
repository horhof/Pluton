Ext.application({
  name: 'Pluton',
  extend: 'Pluton.Application',
  requires: [
    'Pluton.view.Main',
  ],
  mainView: 'Pluton.view.Main'
});

Ext.Loader.setPath({
  Pluton: 'app',
});

Ext.require([
  'Pluton.Api',
]);