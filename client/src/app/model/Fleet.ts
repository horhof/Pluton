interface Fleet extends Ext.data.Model {
}

(Ext.define as (a: string, b: Fleet) => void)(`Pluton.model.Fleet`, {
  entityName: `fleets`,
  extend: `Ext.data.Model`,
  field: [
    {
      name: `id`,
      type: `int`,
    },
    {
      name: `name`,
      type: `string`,
    },
    {
      name: `index`,
      type: `int`,
    },
    {
      name: `mobile`,
      type: `bool`,
    },
    {
      name: `moving`,
      type: `bool`,
    },
    {
      name: `ticks_remaining`,
      type: `int`,
    },
    {
      name: `planet_id`,
      references: `planets`,
      type: `int`,
    },
  ],
  proxy: {
    headers: {
      // @ts-ignore
      'X-API-key': Pluton.Api.getKey(),
    },
    requires: [
      `Pluton.ApiKey`,
    ],
    type: `rest`,
  },
})