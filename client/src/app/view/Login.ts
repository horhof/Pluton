interface LoginVc extends Ext.app.IViewController {
  onClickLogin(sender: Ext.button.IButton): void
}

(Ext.define as (a: string, b: LoginVc) => void)(`Pluton.view.LoginVc`, {
  alias: [`controller.login`],
  extend: `Ext.app.ViewController`,
  onClickLogin: function(sender) {
    console.log(`On click login> Sender=%o This=%o`, sender, this)
  },
})

interface LoginVm extends Ext.app.IViewModel {
  data: {
    name: string
  }
}

(Ext.define as (a: string, b: LoginVm) => void)(`Pluton.view.LoginVm`, {
  alias: [`viewmodel.login`],
  data: {
    name: `P`,
  },
  extend: `Ext.app.ViewModel`,
})