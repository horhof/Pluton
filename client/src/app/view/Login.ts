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
    console.log(`On click login> Sender=%o`, sender)
    const panel = sender.up!(`panel`) as Ext.grid.IGridPanel
    if (!panel) return
    console.log(`On click login> Panel=%o`, panel)
    // @ts-ignore
    const data = panel.getForm().getValues()
    console.log(`On click login> Data=%o`, data)
    const store = Ext.getStore(`player`)
    if (!store) return
    store.loadData!([], false);
    store.add!(data)
    store.sync!({
      callback: function() {
        const record = store.getAt!(0)
        console.log(`On click login> Setting API key... Record=%o`, record)
        // @ts-ignore
        Pluton.Api.setKey(record.data.key)
        console.log(`On click login> Adding a panel...`)
        // @ts-ignore
        panel.remove(0, true)
        // @ts-ignore
        panel.add({ xtype: `mainpanel` })
      },
    })
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