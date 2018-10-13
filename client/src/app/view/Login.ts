interface LoginVc extends Ext.app.IViewController {
  onClickLogin(sender: Ext.button.IButton): void
}

(Ext.define as (a: string, b: LoginVc) => void)(`Pluton.view.LoginVc`, {
  alias: [`controller.login`],
  extend: `Ext.app.ViewController`,
  requires: [
    `Pluton.store.Player`,
  ],
  onClickLogin: function(sender) {
    console.log(`On click login> Sender=%o This=%o`, sender, this)
    const panel = sender.up!(`gridpanel`) as Ext.grid.IGridPanel
    if (!panel) return
    const store = panel.getStore!()
    if (!store) return
    store.add!({ id: null, name: `New user`, email: `test@test.com`, password: `password` })
    store.sync!()
  },
})

interface LoginVm extends Ext.app.IViewModel {
  data: {
    store: PlayerStore,
  }
}

(Ext.define as (a: string, b: LoginVm) => void)(`Pluton.view.LoginVm`, {
  alias: [`viewmodel.login`],
  data: {
    store: Ext.create(`Pluton.store.Player`),
  },
  requires: [
    `Pluton.store.Player`,
  ],
  extend: `Ext.app.ViewModel`,
})