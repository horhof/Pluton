interface PlayerStore extends Ext.data.IStore {
}

(Ext.define as (a: string, b: PlayerStore) => void)(`Pluton.store.Player`, {
  extend: `Ext.data.Store`,
  alias: [`store.player`],
  storeId: `player`,
  model: `Pluton.model.User`,
  autoLoad: true,
})