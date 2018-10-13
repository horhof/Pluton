interface FleetVc extends Ext.app.IViewController {
  onClickRefresh(a: Ext.button.IButton): void
  onClickCreate(a: Ext.button.IButton): void
}

(Ext.define as (a: string, b: FleetVc) => void)(`Pluton.view.FleetVc`, {
  alias: [`controller.fleet`],
  extend: `Ext.app.ViewController`,
  requires: [
    `Pluton.store.Fleet`,
  ],
  onClickRefresh: function(sender) {
    const panel = sender.up!(`gridpanel`) as Ext.grid.IGridPanel
    if (!panel) throw new Error(`No panel.`)
    const store = panel.getStore!()
    if (!store) throw new Error(`No store.`)
    console.log(`[Fleet] On click refresh> Store=%o`, store)
    store.reload!()
  },
  onClickCreate: function(sender) {
    const panel = sender.up!(`gridpanel`) as Ext.grid.IGridPanel
    if (!panel) return
    const store = panel.getStore!()
    if (!store) return
    store.add!({ id: null, name: `New fleet`, planet_id: 1 })
    store.sync!()
  },
})

interface FleetVm extends Ext.app.IViewModel {
  data: {
    store: FleetStore
  }
}

(Ext.define as (a: string, b: FleetVm) => void)(`Pluton.view.FleetVm`, {
  alias: [`viewmodel.fleet`],
  data: {
    store: Ext.create(`Pluton.store.Fleet`),
  },
  extend: `Ext.app.ViewModel`,
  requires: [
    `Pluton.model.Fleet`,
    `Pluton.store.Fleet`,
  ],
})