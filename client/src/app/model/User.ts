interface User extends Ext.data.Model {
}

(Ext.define as (a: string, b: User) => void)(`Pluton.model.User`, {
  extend: `Ext.data.Model`,
  entityName: `users`,
  field: [
    { name: `id`, type: `number` },
    { name: `name`, type: `string` },
    { name: `email`, type: `string` },
    { name: `password`, type: `string` },
    { name: `key`, type: `string` },
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