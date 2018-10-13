interface Planet extends Ext.data.Model {
}

(Ext.define as (a: string, b: Planet) => void)(`Pluton.model.Planet`, {
  extend: `Ext.data.Model`,
  entityName: `planets`,
  field: [
    { name: `id`, type: `int` },
    { name: `name`, type: `string` },
    { name: `index`, type: `int` },
    { name: `star_id`, type: `int` },
    { name: `user_id`, type: `int` },
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