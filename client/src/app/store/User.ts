interface UserStore extends Ext.data.IStore {
}

(Ext.define as (a: string, b: UserStore) => void)(`Pluton.store.User`, {
  extend: `Ext.data.Store`,
  alias: [`store.user`],
  model: `Pluton.model.User`,
  autoLoad: true,
})