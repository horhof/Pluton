interface UserVc extends Ext.app.IViewController {
  onClickUser: (a: Ext.selection.IRowModel, b: Ext.data.IModel) => void
  onClickCreate: (a: Ext.button.IButton) => void
  onClickRefresh: (a: Ext.button.IButton) => void
}

(Ext.define as (a: string, b: UserVc) => void)(`Pluton.view.UserVc`, {
  alias: [`controller.user`],
  extend: `Ext.app.ViewController`,
  requires: [
    `Pluton.store.Player`,
  ],
  onClickUser: function(_, record) {
    const player = Ext.getStore(`player`)
    player.loadData!([record])
    // @ts-ignore
    //Pluton.Api.setKey(record.get('name'))
  },
  onClickCreate: function(sender) {
    const panel = sender.up!(`gridpanel`) as Ext.grid.IGridPanel
    if (!panel) return
    const store = panel.getStore!()
    if (!store) return
    store.add!({ id: null, name: `New user`, email: `test@test.com`, password: `password` })
    store.sync!()
  },
  onClickRefresh: function(sender) {
    const panel = sender.up!(`gridpanel`) as Ext.grid.IGridPanel
    if (!panel) return
    panel.getStore!().reload!()
  }
})

interface UserVm extends Ext.app.IViewModel {
  data: {
    player: PlayerStore,
    store: UserStore,
  }
}

(Ext.define as (a: string, b: UserVm) => void)(`Pluton.view.UserVm`, {
  alias: [`viewmodel.user`],
  data: {
    player: Ext.create(`Pluton.store.Player`),
    store: Ext.create(`Pluton.store.User`),
  },
  extend: `Ext.app.ViewModel`,
  requires: [
    `Pluton.store.Player`,
    `Pluton.store.User`,
  ],
})