interface FleetStore extends Ext.data.IStore {
}

(Ext.define as (a: string, b: FleetStore) => void)(`Pluton.store.Fleet`, {
  extend: `Ext.data.Store`,
  alias: [`store.fleet`],
  model: `Pluton.model.Fleet`,
  autoLoad: true,
})