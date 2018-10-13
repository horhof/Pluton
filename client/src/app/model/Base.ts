Ext.define('Pluton.Api', {
  singleton: true,
  config: {
    key: ``,
  },
  constructor: function(config: any) {
    this.initConfig(config);
    this.callParent([config]);
  }
});

Ext.define(`Pluton.model.Base`, {
  extend: `Ext.data.Model`,
  schema: {
    namespace: `Pluton.model`,
    proxy: {
      type: `rest`,
      url: `/{entityName}`,
      reader: {
        type: `json`,
      },
    },
  },
})